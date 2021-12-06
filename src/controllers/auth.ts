import { Request, Response } from 'express';
import { Connect, MutlipleQuery, EndConnection } from '../utils/db';
import { Connection } from 'mysql';

/**
 * Controller that check if the user has already linked his account.
 * Check if the user has already linked his account.
 * If not, return that u need to link wallet
 * @param req
 * @param res
 */
async function checkIfLinked(req: any, res: Response) {
    try {
        const connection: any = await Connect();
        const isLinked: any = await MutlipleQuery(connection, `SELECT COUNT(*) FROM twitter_vite WHERE twitter_name = ?`, [req.user.username]);
        if (!isLinked) {
            EndConnection(connection);
            return res.status(200).json({ message: 'Successfully logged in' });
        }
        EndConnection(connection);
        return res.status(202).json({ message: 'You must link your Vite wallet' });
    } catch (error) {
        res.status(500);
    }
}

/**
 * Link the user's twitter account to his Vite wallet address.
 * @param req
 * @param res
 */
async function linkAccount(req: any, res: any) {
    const { vite } = req.body;
    console.log(vite);
    if (!vite) return res.status(400).json({ message: 'Vite address is required' });
    try {
        const connection: any = await Connect();
        await MutlipleQuery(connection, 'INSERT INTO twitter_vite (twitter_id, twitter_name, vite_address) VALUES (?, ?, ?)', [req.user.id, req.user.username, vite]);
        return res.status(200).json({ message: 'Successfully linked your account' });
    } catch (error) {
        res.status(500);
    }
}

export { checkIfLinked, linkAccount };
