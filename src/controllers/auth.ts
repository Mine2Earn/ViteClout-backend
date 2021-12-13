// @ts-ignore
import { utils, wallet } from '@vite/vitejs';
import { Response } from 'express';
import { Connect, Query } from '../utils/db';

/**
 * Controller that check if the user has already linked his account.
 * Check if the user has already linked his account.
 * If not, return that u need to link wallet
 * @param req
 * @param res
 */
export const checkIfLinked = async (req: any, res: Response) => {
    try {
        const connection: any = await Connect();
        const isLinked: any = await Query(connection, `SELECT COUNT(*) as isLinked FROM twitter_vite WHERE twitter_name = ?`, [req.user.username]);
        if (isLinked[0].isLinked) {
            return res.status(200).json({ message: 'Successfully logged in.' });
        }
        return res.status(202).json({ message: 'You must link your Vite wallet.' });
    } catch (error) {
        res.status(500);
    }
};

/**
 * Link the user's twitter account to his Vite wallet address.
 * @param req
 * @param res
 */
export const linkAccount = async (req: any, res: Response) => {
    const { vite } = req.query;
    console.log(vite);
    if (!vite) return res.status(400).json({ message: 'Vite address is required.' });
    try {
        const connection: any = await Connect();
        await Query(connection, 'INSERT INTO twitter_vite (twitter_id, twitter_name, vite_address) VALUES (?, ?, ?)', [req.user.id, req.user.username, vite]);
        return res.status(200).json({ message: 'Successfully linked your account.' });
    } catch (error) {
        res.status(500);
    }
};

var lastNonce: number = 1;
const addressToNonce: any = {};

/**
 * Endpoint to get the nonce for the given address.
 * @param req must contains the vite address as `address`
 * @param res
 * @returns {Hex} `nonce`
 */
export const getNonce = (req: any, res: Response) => {
    const { address } = req.query;
    if (!address) return res.status(400).json({ message: 'Vite address is required.' });
    const nonce = utils.blake2bHex('Hello'); // TODO: Generate nonce
    addressToNonce[address] = nonce;
    res.status(200).json({ nonce, message: 'Ok.' });
};

// verify => message, signature, publicKey
/**
 * Endpoint to verify the signature of the message. If the signature is valid, link twitter and vite.
 * @param req must contains encoded nonce as `signed`, `publicKey` and `address`
 * @param res
 */
export const verifyNonce = async (req: any, res: Response) => {
    const { signed, publicKey, address } = req.body;
    const message = addressToNonce[address];
    const temp = wallet.getAddressFromPublicKey(publicKey);
    console.log(message, temp, address);
    if (!message) return res.status(400).json({ message: 'Invalid address.' });
    if (!signed || !publicKey || !address) return res.status(400).json({ message: 'Nonce, public key and address are required.' });
    if (!wallet.getAddressFromPublicKey(publicKey) === address) return res.status(400).json({ message: 'Invalid address/public key.' });
    if (!utils.ed25519.verify(message, signed, publicKey)) return res.status(400).json({ message: 'Invalid signature.' });
    try {
        const connection: any = await Connect();
        await Query(connection, 'INSERT INTO vuilders(twitter_id, twitter_tag, address) VALUES (?, ?, ?)', [req.user.id, req.user.username, address]);
        delete addressToNonce[address];
        return res.status(200).json({ message: 'Your twitter and vite address are now linked.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error, please retry.' });
    }
};
