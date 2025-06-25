import prisma from '../config/db';
import bcrypt from 'bcryptjs';

export const createUser = async ( name: string, email: string, password: string, roleId: string ) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: { name, email, password: hashedPassword,
      roles: {
        create: {
          role: {
            connect: { id: roleId },
          },
        },
      },
    },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    omit: {
      password: true
    },
    include: {
      roles: {
        include: {
          role: true, // ⬅️ Include relasi ke Role
        },
      },
    },
  });
};
