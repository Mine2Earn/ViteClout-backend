import { Request, Response } from 'express';
import { upload } from '../middlewares/upload';

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
