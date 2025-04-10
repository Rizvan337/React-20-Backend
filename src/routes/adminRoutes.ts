import User from '../models/User';
import { verifyToken } from '../middlewares/authMiddleware';
import express, { Request, Response } from 'express';
const router = express.Router();
import { asyncHandler } from '../utils/asynHandler';
import bcrypt from 'bcryptjs'; 

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


router.post('/create-user', verifyToken, asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role,
  });

  const savedUser = await newUser.save();

  const { password: _, ...userWithoutPassword } = savedUser.toObject();

  res.status(201).json(userWithoutPassword);
}));

export default router;
