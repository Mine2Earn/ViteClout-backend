import { Request, Response } from 'express';
import { upload } from '../middlewares/upload';
import { Connect, Query } from '../utils/db';

export const uploadImage = (req: Request, res: Response) => {
    console.log('Image ', req.files);
    upload.single('avatar')(req, res, err => {
        console.log('Upload error: ' + err);
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
