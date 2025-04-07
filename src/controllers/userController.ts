import { Request, Response } from 'express';
import User from '../models/User';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
  user?: {
    id: string;
  };
}

export const uploadProfileImage = async (
  req: MulterRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!req.file?.path) {
       res.status(400).json({ error: 'No image uploaded' });
       return
    }

    const imagePath = req.file.path.replace(/\\/g, '/').replace(/^.*\/uploads\//, 'uploads/');

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: imagePath },
      { new: true }
    );

     res.status(200).json({ message: 'Image uploaded', user });
  } catch (error) {
    console.error('Upload error:', error);
     res.status(500).json({ error: 'Something went wrong' });
  }
};
