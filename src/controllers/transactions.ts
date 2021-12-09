import { Request, Response } from 'express';
import { Connect, Query } from '../utils/db';

/**
 * Endpoint to get all transactions from a token
 * @param req must contains `token_id`
 * @param res
 */
export const getTransactionsFromTokenId = async (req: Request, res: Response) => {
    const { token_id } = req.query;
    if (!token_id) return res.status(400).json({ message: 'You must give a token id.' });
    try {
        const connection: any = await Connect();
        const result: any = await Query(connection, 'SELECT * FROM transactions WHERE token_id = ?', [String(token_id)]);
        console.log(result);
        return res.status(200).json({ result, message: 'Ok' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error, please retry.' });
    }
};

/**
 * Endpoint to count number of holder for a token id
 * TODO: What do we count here ?
 * @param req must contains `token_id`
 * @param res
 */
export const countHolderFromTokenId = async (req: Request, res: Response) => {
    const { token_id } = req.query;
    if (!token_id) return res.status(400).json({ message: 'You must give a token_id.' });
    try {
        const connection: any = await Connect();
        const result: any = await Query(connection, 'SELECT COUNT(holder) as NumberHolder FROM transactions WHERE token_id = ?', [String(token_id)]);
        console.log(result);
        return res.status(200).json({ result, message: 'Ok' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error, please retry.' });
    }
};

/**
 * Endpoint to get the last 10 transactions
 * @param req
 * @param res
 */
export const getLastTransactions = async (req: Request, res: Response) => {
    try {
        const connection: any = await Connect();
        const result: any = await Query(connection, 'SELECT * FROM transactions ORDER BY timestamp DESC LIMIT 10');
        console.log(result);
        return res.status(200).json({ result, message: 'Ok' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error, please retry.' });
    }
};

/**
 * Endpoint to get all transactions of an Holder
 * @param req must contains `holder`
 * @param res
 */
export const getAllTransactionsOfHolder = async (req: Request, res: Response) => {
    const { holder } = req.query;
    if (!holder) return res.status(400).json({ message: 'You must give an holder.' });
    try {
        const connection: any = await Connect();
        const result: any = await Query(connection, 'SELECT * FROM transactions where holder = ?', [String(holder)]);
        console.log(result);
        return res.status(200).json({ result, message: 'Ok' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error, please retry.' });
    }
};

/**
 * Endpoint to get all balances (of every tokens) of an holder
 * @param req must contains `holder`
 * @param res
 */
export const getAllBalancesOfHolder = async (req: Request, res: Response) => {
    const { holder } = req.query;
    if (!holder) return res.status(400).json({ message: 'You must give an holder.' });
    try {
        const connection: any = await Connect();
        const result: any = await Query(connection, 'SELECT token_id, SUM(amount) as amount FROM transactions WHERE holder = ? GROUP BY token_id', [String(holder)]);
        console.log(result);
        return res.status(200).json({ result, message: 'Ok' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error, please retry.' });
    }
};
