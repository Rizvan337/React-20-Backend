import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      res.status(401).json({ msg: 'No token, authorization denied' });
      return;
    }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded; // attach decoded payload to req
    next();
  } catch (err) {
     res.status(401).json({ msg: 'Token is not valid' });
  }
};
