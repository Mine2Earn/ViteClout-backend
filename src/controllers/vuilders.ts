import { Request, Response } from 'express';
import { Connect, Query } from '../utils/db';

/**
 * Endpoint to get the address of a Vuilders with his twitter tag
 * @param req must contains `twitter_tag`
 * @param res
 */
export const addressFromTag = async (req: Request, res: Response) => {
    const { twitter_tag } = req.query;
    if (!twitter_tag) return res.status(400).json({ message: 'You must give a twitter_tag.' });
    try {
        const connection: any = await Connect();
        const result: any = await Query(connection, 'SELECT address FROM vuilders WHERE twitter_tag = ?', [String(twitter_tag)]);
        console.log(result[0]);
        return res.status(200).json({ address: result[0].address, message: 'Ok' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error, please retry.' });
    }
};

/**
 * Endpoint to get the twitter tag of a Vuilders from his address
 * @param req must contains `address`
 * @param res
 */
export const tagFromAddress = async (req: Request, res: Response) => {
    const { address } = req.query;
    if (!address) return res.status(400).json({ message: 'You must give an address.' });
    try {
        const connection: any = await Connect();
        const result: any = await Query(connection, 'SELECT twitter_tag FROM vuilders WHERE address = ?', [String(address)]);
        return res.status(200).json({ twitter_tag: result[0].twitter_tag, message: 'Ok' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error, please retry.' });
    }
};
