import User from '../models/User';
import { verifyToken } from '../middlewares/authMiddleware';
import express, { Request, Response } from 'express';
const router = express.Router();
import { asyncHandler } from '../utils/asynHandler';

router.get('/users', verifyToken, asyncHandler(async(req, res) => {
  try {
    const users = await User.find({}, '-password'); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  } 
})
);


router.put('/users/:id', verifyToken, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
})
);


router.delete('/users/:id', verifyToken,asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
})
);


export default router;
