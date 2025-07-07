import { Request, Response, NextFunction } from 'express';
import { getProfileByUserId, updateProfile } from '../services/profile.service';

export const getMyProfileHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const profile = await getProfileByUserId(userId);
    res.json({
      success: true,
      message: 'Berhasil mendapatkan data profil',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfileHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const updatedProfile = await updateProfile(userId, req.body);
    res.status(200).json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};