import prisma from '../config/db';
import { UserProfile } from '@prisma/client';

export type ProfileUpdatePayload = Partial<Omit<UserProfile, 'user_id' | 'created_at' | 'updated_at'>>;

const profilePublicData = {
  user_id: true,
  whatsapp_number: true,
  location: true,
  date_of_birth: true,
  last_education: true,
  profile_picture_url: true,
  user: {
    select: {
      name: true,
      email: true,
    }
  }
};

export const getProfileByUserId = async (userId: string) => {
  const userProfile = await prisma.userProfile.upsert({
    where: { user_id: userId },
    update: {},
    create: {
      user_id: userId,
      created_at: new Date(),
    },
    select: profilePublicData,
  });
  return userProfile;
};

export const updateProfile = async (userId: string, data: ProfileUpdatePayload) => {
  if (Object.keys(data).length === 0) {
    throw new Error("Tidak ada data yang dikirim untuk diperbarui.");
  }

  return prisma.userProfile.update({
    where: {
      user_id: userId,
    },
    data: data,
    select: profilePublicData,
  });
};