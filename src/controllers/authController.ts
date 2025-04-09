import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { IUser } from '../models/User';
import { HttpStatus } from '../utils/httpStatus';

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) throw new Error('JWT_SECRET must be defined in .env');

// REGISTER
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser: IUser | null = await User.findOne({ email });
    if (existingUser) {
      res.status(HttpStatus.BAD_REQUEST).json({ msg: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

     const adminExists = await User.findOne({ role: 'admin' });

    const role: 'user' | 'admin' = adminExists ? 'user' : 'admin'; // First user becomes admin

    const user: IUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });


    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(HttpStatus.CREATED).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(HttpStatus.SERVER_ERROR).json({ msg: 'Server error' });
  }
};

// LOGIN
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email);
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found in DB for email:', email);
      res.status(HttpStatus.NOT_FOUND).json({ msg: 'User not found' });
      return;
    }
    console.log('✅ User found:', user.email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Password mismatch');
      res.status(HttpStatus.UNAUTHORIZED).json({ msg: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(HttpStatus.OK).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, 
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(HttpStatus.SERVER_ERROR).json({ msg: 'Server error' });
  }
};
