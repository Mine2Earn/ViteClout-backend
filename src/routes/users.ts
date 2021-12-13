import { Router } from 'express';
import { uploadImage, updateBio } from '../controllers/users';
import isLoggedIn from '../middlewares/isLoggedIn';

const router = Router();

// Dev purposes
// router.get('/upload', (req, res) =>
//     res.send(`<form method="post" action="/users/upload" enctype="multipart/form-data"><input type="file" name="avatar"><input type="submit" value="submit"></form>`)
// );
router.post('/upload', isLoggedIn, uploadImage);
router.post('/bio', isLoggedIn, updateBio);

export default router;
