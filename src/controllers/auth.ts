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
const nonceToAddress: any = {};

export const getNonce = (req: any, res: Response) => {
    const { address } = req.query;
    if (!address) return res.status(400).json({ message: 'Vite address is required.' });
    const nonce = lastNonce++; // TODO: Generate nonce
    nonceToAddress[nonce] = address;
    res.status(200).json({ nonce, message: 'Ok.' });
};

export const verifyNonce = async (req: any, res: Response) => {
    const { nonce, publicKey } = req.body;
    const user = req.user;
    console.log(req.user);
    if (!nonce || !publicKey) return res.status(400).json({ message: 'Nonce and public key are required.' });
    const decoded = nonce; // TODO: Should be decoded
    const address = nonceToAddress[decoded];
    console.log(nonceToAddress);
    console.log(decoded, address);
    if (!address) return res.status(400).json({ message: 'Nonce or public key is/are invalid.' });
    try {
        const connection: any = await Connect();
        const query: any = await Query(connection, 'INSERT INTO vuilders(twitter_id, twitter_tag, address) VALUES (?, ?, ?)', [user.id, user.username, address]);
        return res.status(200).json({ message: 'Your twitter and vite address are now linked.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error, please retry.' });
    }
};
