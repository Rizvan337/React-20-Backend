    import express from 'express';
    import upload from '../middlewares/upload';
    import { verifyToken } from '../middlewares/authMiddleware';
    import { uploadProfileImage } from '../controllers/userController';
    import User from '../models/User'

    const router = express.Router();
    router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user?.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

    router.post('/upload-profile', verifyToken, upload.single('image'), uploadProfileImage);

    export default router;
