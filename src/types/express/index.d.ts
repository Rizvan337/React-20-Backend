import { IUser } from '../../models/User';

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File; 
      user?: {
        id: string;
      };
    }
  }
}
