import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Connect, Query } from '../utils/db';
console.log(path.join(__dirname, '../../public/images'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Pass destination');
        cb(null, path.join(__dirname, '../../public/images'));
    },
    filename: async (req: any, file, cb) => {
        console.log('Pass filename');
        const filename = uuidv4() + path.extname(file.originalname);
        try {
            const connection: any = await Connect();
            await Query(connection, 'UPDATE vuilders SET avatar = ? WHERE twitter_id = ?', [String('http://localhost:3001/public/images' + filename), req.user.id]);
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
        console.log('Pass fileFilter');
        // This is a very basic check, watch out in production
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new Error('This is not an image.'));
        }
    }
});
