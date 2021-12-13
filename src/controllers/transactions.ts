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
        const result: any = await Query(connection, 'SELECT * FROM transactions as t JOIN vuilders as v ON t.token_id = v.address WHERE token_id = ?', [
            String(token_id)
        ]);
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
        const result: any = await Query(connection, 'SELECT * FROM transactions as t JOIN vuilders as v ON t.token_id = v.address ORDER BY timestamp DESC LIMIT 10');
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
        const result: any = await Query(connection, 'SELECT * FROM transactions as t JOIN vuilders as v ON t.token_id = v.address WHERE holder = ?', [String(holder)]);
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
        return res.status(200).json({ result, message: 'Ok' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error, please retry.' });
    }
};

/**
 * Endpoint to get all the token info
 * @param req
 * @param res
 * @returns if req.query.orderBy is set to `holders` then the result will be ordered by the number of holders
 * else it will be ordered by the number of sell
 */
export const getAllTokenInfo = async (req: Request, res: Response) => {
    const query =
        req.query.orderBy === 'holders'
            ? 'SELECT token_id, COUNT(holder) as holders, SUM(amount) as numberSell, 0.003 * (SUM(amount) + 1) * (SUM(amount) + 1) as buyPrice, 0.003 * (SUM(amount) - 1) * (SUM(amount) - 1) as sellPrice FROM transactions as t JOIN vuilders as v ON t.token_id = v.address GROUP BY token_id ORDER BY holders DESC, numberSell DESC'
            : 'SELECT token_id, COUNT(holder) as holders, SUM(amount) as numberSell, 0.003 * (SUM(amount) + 1) * (SUM(amount) + 1) as buyPrice, 0.003 * (SUM(amount) - 1) * (SUM(amount) - 1) as sellPrice FROM transactions as t JOIN vuilders as v ON t.token_id = v.address GROUP BY token_id ORDER BY numberSell DESC, holders DESC';
    try {
        const connection: any = await Connect();
        const result: any = await Query(connection, query);
        console.log(result);
        return res.status(200).json({ result, message: 'Ok' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error, please retry.' });
    }
};
