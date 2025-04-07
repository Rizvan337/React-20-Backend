// src/routes/adminRoutes.ts
import express from 'express';
import User from '../models/User';
import { verifyToken } from '../middlewares/authMiddleware';

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

export default router;
