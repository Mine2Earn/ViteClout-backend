import { Connect, Query } from '../utils/db';
import { abi } from '@vite/vitejs';
import HTTP_RPC from '@vite/vitejs-http';

// HTTPS seems to be more reliable than WS
const httpProvider = new HTTP_RPC('https://buidl.vite.net/gvite');

const contractAddress = 'vite_8792374da714b67944ddb62590108ab1a05c52a1e7d6be8715';

enum EVENTTYPE {
    BUY = 1,
    SELL = 0,
    MINT = 2
}

type ViteAddress = string;

// Contract ABI
const ABI = [
    {
        constant: true,
        inputs: [{ name: 'vftid', type: 'address' }],
        name: 'getSellPrice',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'offchain'
    },
    { constant: false, inputs: [], name: 'mint', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' },
    {
        constant: true,
        inputs: [{ name: 'vftid', type: 'address' }],
        name: 'getReserve',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'offchain'
    },
    { constant: false, inputs: [{ name: 'vftid', type: 'address' }], name: 'buyVFT', outputs: [], payable: true, stateMutability: 'payable', type: 'function' },
    { constant: false, inputs: [{ name: 'vftid', type: 'address' }], name: 'sellVFT', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' },
    {
        constant: true,
        inputs: [{ name: 'vftid', type: 'address' }],
        name: 'getBuyPrice',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'offchain'
    },
    {
        constant: true,
        inputs: [
            { name: 'vftid', type: 'address' },
            { name: 'holder', type: 'address' }
        ],
        name: 'getBalance',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'offchain'
    },
    { inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor' },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'addr', type: 'address' },
            { indexed: true, name: 'vftid', type: 'address' },
            { indexed: false, name: 'value', type: 'uint256' },
            { indexed: false, name: 'tid', type: 'tokenId' }
        ],
        name: 'buyEvent',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'addr', type: 'address' },
            { indexed: true, name: 'vftid', type: 'address' },
            { indexed: false, name: 'value', type: 'uint256' },
            { indexed: false, name: 'tid', type: 'tokenId' }
        ],
        name: 'sellEvent',
        type: 'event'
    },
    { anonymous: false, inputs: [{ indexed: true, name: 'addr', type: 'address' }], name: 'mintEvent', type: 'event' }
];

const BUYEVENTID = abi.encodeLogSignature(ABI, 'buyEvent');
const SELLEVENTID = abi.encodeLogSignature(ABI, 'sellEvent');
const MINTEVENTID = abi.encodeLogSignature(ABI, 'mintEvent');

export function init() {
    let refresh = async () => {
        try {
            let startHeight = await getLastHeight();
            updateDB(startHeight);
        } catch (error) {
            console.error(error); // We don't crash the app on error
        }
    };

    refresh();
    setInterval(refresh, 60 * 1000);
}

// Return account block information by hash Id
async function fetchInfoByBlockHash(hashId: string) {
    console.log('Fetch', hashId);
    try {
        let block = await httpProvider.request('ledger_getAccountBlockByHash', [hashId]);
        console.log('RETURNED');
        return {
            height: block.result.height,
            holder: block.result.fromAddress
        };
    } catch (error) {
        console.error('ERROR', error);
    }
}

// Query the last heigh in the DB
async function getLastHeight(): Promise<number> {
    return new Promise(async (resolve, reject) => {
        const connection: any = await Connect();
        Query(connection, 'SELECT timestamp FROM transactions ORDER BY timestamp desc LIMIT 1')
            .then(res => {
                resolve(Promise.resolve(res[0]?.timestamp || 1));
            })
            .catch(reject);
    });
}

// Fetch all the logs since the account block @start, and add to db BUY and SELL Event
async function updateDB(start: number) {
    httpProvider
        .request('ledger_getVmLogsByFilter', [
            {
                addressHeightRange: {
                    [contractAddress]: {
                        fromHeight: (start + 1).toString(),
                        toHeight: '0'
                    }
                }
            }
        ])
        .then(res => {
            if (res.result == null) return;
            res.result.forEach(ab => {
                if (ab.vmlog.data === null) return;
                if (ab.vmlog.topics.includes(BUYEVENTID)) {
                    console.log('BUY');
                    const raw_data = Buffer.from(ab.vmlog.data, 'base64').toString('hex');
                    let test: any = abi.decodeLog(ABI, raw_data, ab.vmlog.topics, 'buyEvent');

                    fetchInfoByBlockHash(ab.accountBlockHash).then(info => {
                        addToDB(ab.accountBlockHash, EVENTTYPE.BUY, info.holder, test.value, info.height, test.vftid);
                    });
                } else if (ab.vmlog.topics.includes(SELLEVENTID)) {
                    console.log('SELL');
                    const raw_data = Buffer.from(ab.vmlog.data, 'base64').toString('hex');
                    let test: any = abi.decodeLog(ABI, raw_data, ab.vmlog.topics, 'sellEvent');

                    fetchInfoByBlockHash(ab.accountBlockHash).then(info => {
                        addToDB(ab.accountBlockHash, EVENTTYPE.SELL, info.holder, test.value, info.height, test.vftid);
                    });
                }
                console.log('-------END---------');
            });
        })
        .catch(err => {
            console.error('ERROR', err);
        });
    return Promise.resolve([]);
}

// Add transaction into the DB
async function addToDB(hashId: string, type: EVENTTYPE, holder: ViteAddress, price: number, timestamp: number | string, vftId: ViteAddress) {
    if (type == EVENTTYPE.MINT) return; // We only add to db SELL or BUY Events

    const connection: any = await Connect();
    Query(connection, 'INSERT INTO transactions (hash_id, type, holder, amount, price, timestamp, token_id) VALUES(?,?,?,?,?,?,?)', [
        hashId,
        type.toString(),
        holder,
        '1',
        price.toString(),
        timestamp.toString(),
        vftId
    ]).catch(err => {
        console.log(err.code);
    });
}