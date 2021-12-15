import { Request, Response } from 'express';
import { Connect, Query } from '../utils/db';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.TWITTER_BEARER}`;

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
        if (!result[0]) return res.status(404).json({ message: 'Vuilder not found.' });
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
        if (!result[0].twitter_tag) return res.status(400).json({ message: 'This address is not linked to a vuilder.' });
        return res.status(200).json({ twitter_tag: result[0].twitter_tag, message: 'Ok' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error, please retry.' });
    }
};

/**
 * Endpoint to get info about an Array of Vuilders
 * @param req must contains `twitter_tag` as Array
 * @param res
 */
export const info = async (req: Request, res: Response) => {
    const twitter_tag = req.query.twitter_tag;
    if (typeof twitter_tag !== 'string') return;
    try {
        const parsed = JSON.parse(twitter_tag);
        let inte = '';
        // Make placeholders for the number of twitter tag (?,?,?,...)
        parsed.forEach((tag: string, index: number) => (index === parsed.length - 1 ? (inte += ' ?') : (inte += ' ?,')));

        if (!twitter_tag || twitter_tag.length === undefined) {
            return res.status(400).json({ message: 'You must give an array of twitter_tag.' });
        }

        const connection: any = await Connect();
        const result: any = await Query(connection, `SELECT * FROM vuilders WHERE twitter_tag IN (${inte})`, parsed);
        return res.status(200).json({ vuilders: result, message: 'Ok' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error: is your req well formed?' });
    }
};

/**
 * Endpoint to the number of followers and followed of a Vuilders (on twitter)
 * @param req must contains `twitter_tag`
 * @param res
 */
export const twitterInfo = async (req: Request, res: Response) => {
    const { twitter_tag } = req.query;
    try {
        const user = await axios.get(`https://api.twitter.com/2/users/by/username/${twitter_tag}`);
        const follow_count: any = await axios.get(`https://api.twitter.com/2/users/${user.data.data.id}/followers`);
        const followed_count: any = await axios.get(`https://api.twitter.com/2/users/${user.data.data.id}/following`);
        return res.status(200).json({
            follow_count: follow_count.data.meta.result_count,
            followed_count: followed_count.data.meta.result_count,
            message: 'Ok'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Twitter Error' });
    }
};

/**
 * Endpoint to get if a twitter_tag is vuilder
 * @param req must contains `twitter_tag`
 * @param res
 */
export const isVuilder = async (req: Request, res: Response) => {
    const { twitter_tag } = req.query;
    if (!twitter_tag) return res.status(400).json({ message: 'You must give a twitter_tag.' });
    try {
        const connection: any = await Connect();
        const result = await Query(connection, 'SELECT isVuilder FROM vuilders WHERE twitter_tag = ?', [String(twitter_tag)]);
        if (!result[0]) return res.status(404).json({ message: 'Vuilder not found.' });
        return res.status(200).json({ isVuilder: result[0].isVuilder, message: 'Ok' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Server Error, please retry.' });
    }
};
