import { Request, Response, NextFunction } from 'express';
import { getProfileByUserId, updateProfile } from '../services/profile.service';

function formatDateToDDMMYYYY(date: Date | string | null | undefined) {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export const getMyProfileHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const profile = await getProfileByUserId(userId);
    if (profile && profile.date_of_birth) {
      (profile as any).date_of_birth = formatDateToDDMMYYYY(profile.date_of_birth);
    }
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
    if (updatedProfile && updatedProfile.date_of_birth) {
      (updatedProfile as any).date_of_birth = formatDateToDDMMYYYY(updatedProfile.date_of_birth);
    }
    res.status(200).json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};