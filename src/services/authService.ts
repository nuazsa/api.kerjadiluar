import prisma from '../config/db';
import bcrypt from 'bcryptjs';
import { generateAuthToken } from '../utils/jwt';

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

  if (!user) throw new Error('Email tidak ditemukan.');

  const isValid = await bcrypt.compare(password, user.password || '');
  if (!isValid) throw new Error('Password salah.');

  const userRoles = user.roles.map((r) => r.role.name.toLowerCase());

  if (loginType === 'backoffice') {
    const allowed = ['admin', 'manajer'];
    const allowedAccess = userRoles.some((r) => allowed.includes(r));
    if (!allowedAccess) throw new Error('Akses backoffice ditolak.');
  } else if (loginType === 'main') {
    const blocked = ['admin', 'manajer'];
    const blockedOnly = userRoles.every((r) => blocked.includes(r));
    if (blockedOnly) throw new Error('Akun ini hanya untuk backoffice.');
  } else {
    throw new Error('Tipe login tidak valid.');
  }
  console.log(userRoles);
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
