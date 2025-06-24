import prisma from '../config/db';
import bcrypt from 'bcryptjs';

export const createUser = async (name: string, email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
};

export const getAllUsers = async () => {
  return prisma.user.findMany();
};
