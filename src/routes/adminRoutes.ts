// src/routes/adminRoutes.ts
import User from '../models/User';
import { verifyToken } from '../middlewares/authMiddleware';
import express, { Request, Response } from 'express';
const router = express.Router();

// Get all users
router.get('/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.put('/users/:id', verifyToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.name = name || user.name;
    user.email = email || user.email;

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
