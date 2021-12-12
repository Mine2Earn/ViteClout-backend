import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Connect, Query } from '../utils/db';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/images'));
    },
    filename: async (req: any, file, cb) => {
        const filename = uuidv4() + path.extname(file.originalname);
        try {
            const connection: any = await Connect();
            await Query(connection, 'UPDATE vuilders SET avatar = ? WHERE twitter_id = ?', [String(filename), req.user.id]);
            cb(null, filename);
        } catch (err) {
            console.log(err);
            cb(new Error('Server Error'), null);
        }
    }
});

export const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // This is a very basic check, watch out in production
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new Error('This is not an image.'));
        }
    }
});
