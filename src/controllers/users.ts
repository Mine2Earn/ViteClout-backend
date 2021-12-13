import { Request, Response } from 'express';
import { upload } from '../middlewares/upload';
import { Connect, Query } from '../utils/db';

const up = upload.single('avatar');

export const uploadImage = (req: Request, res: Response) => {
    up(req, res, err => {
        if (err) res.status(500).json({ message: 'Error uploading file.' });
        else {
            console.log(req.files);
            res.status(200).json({ message: 'image uploaded.' });
        }
    });
};

export const updateBio = async (req: any, res: Response) => {
    try {
        const connection: any = await Connect();
        await Query(connection, 'UPDATE vuilders SET bio = ? WHERE twitter_id = ?', [req.body.bio, req.user.twitter_id]);
        res.status(200).json({ message: 'bio updated.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating bio.' });
    }
};
