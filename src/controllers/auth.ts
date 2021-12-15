// @ts-ignore
import { utils, wallet } from '@vite/vitejs';
import { Response } from 'express';
import { Connect, Query, MutlipleQuery, EndConnection } from '../utils/db';
import { v4 as uuidv4 } from 'uuid';

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
        const isLinked: any = await Query(connection, `SELECT address FROM vuilders WHERE twitter_id = ?`, [req.user.twitter_id]);
        console.log(isLinked[0].address);
        if (isLinked[0].address) {
            return res.status(200).json({ message: 'Successfully logged in.' });
        }
        return res.status(202).json({ message: 'You must link your Vite wallet.' });
    } catch (error) {
        res.status(500);
    }
};

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
    // Generate nonce from uuid because it's secure
    const nonce = utils.blake2bHex(uuidv4());
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

    // Check if all inputs are valid
    if (!message) return res.status(400).json({ message: 'Invalid address.' });
    if (!signed || !publicKey || !address) return res.status(400).json({ message: 'Nonce, public key and address are required.' });
    if (!wallet.getAddressFromPublicKey(publicKey) === address) return res.status(400).json({ message: 'Invalid address/public key.' });

    // We need this try catch because the signature is not always valid, and if so it will throw an error.
    try {
        if (!utils.ed25519.verify(message, signed, publicKey)) return res.status(400).json({ message: 'Invalid signature.' });
    } catch (e) {
        return res.status(400).json({ message: 'Invalid signature.' });
    }

    // If everything is valid, link twitter and vite
    try {
        const connection: any = await Connect();
        await Query(connection, 'INSERT INTO vuilders(twitter_id, twitter_tag, address) VALUES (?, ?, ?)', [req.user.twitter_id, req.user.username, address]);
        delete addressToNonce[address];
        return res.status(200).json({ message: 'Your twitter and vite address are now linked.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error: Did your account not already linked ?' });
    }
};

export const link = async (req: any, res: Response) => {
    if (!req.body.address) return res.status(400).json({ message: 'Address is required.' });
    try {
        const connection: any = await Connect();
        const result = await MutlipleQuery(connection, 'SELECT address FROM vuilders WHERE twitter_id = ?', [req.user.twitter_id]);
        if (result[0].address !== null) {
            return res.status(400).json({ message: 'You address is already linked' });
        }
        await MutlipleQuery(connection, 'UPDATE vuilders SET address = ? WHERE twitter_id = ?', [req.body.address, req.user.twitter_id]);
        EndConnection(connection);
        return res.status(200).json({ message: 'Your twitter and vite address are now linked.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error: Did your account not already linked ?' });
    }
};
