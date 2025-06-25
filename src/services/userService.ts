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

export const getUsers = async (filters: { roleId?: string; name?: string }) => {
  const { roleId, name } = filters;

  return prisma.user.findMany({
    where: {
      ...(name && {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      }),
      ...(roleId && {
        roles: {
          some: {
            role_id: roleId,
          },
        },
      }),
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
