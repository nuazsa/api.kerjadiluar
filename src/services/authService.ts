import prisma from '../config/db';
import bcrypt from 'bcryptjs';
import { generateAuthToken } from '../utils/jwt';

const userPublicData = {
  id: true,
  name: true,
  email: true,
  created_at: true,
  roles: {
    select: {
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
};

export const createUser = async ( name: string, email: string, password: string, roleId: string = 'rl1' ) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      roles: {
        create: {
          role: {
            connect: { id: roleId },
          },
        },
      },
    },
    select: userPublicData,
  });
};

export const loginService = async (
  email: string,
  password: string,
  loginType: 'main' | 'backoffice'
) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user || !user.password) {
    throw new Error('Email atau password salah.');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Email atau password salah.');
  }

  const userRoles = user.roles.map((r) => r.role.name.toLowerCase());

  if (loginType === 'backoffice') {
    const allowed = ['admin', 'manajer'];
    const allowedAccess = userRoles.some((r) => allowed.includes(r));
    if (!allowedAccess) throw new Error('Akses backoffice ditolak.');
  } else {
    const blocked = ['admin', 'manajer'];
    const blockedOnly = userRoles.every((r) => blocked.includes(r));
    if (blockedOnly) throw new Error('Akun ini hanya untuk backoffice.');
  }
  
  const token = generateAuthToken(user.id, user.name, userRoles);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: userRoles,
    },
    token,
  };
};
