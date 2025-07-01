import { Request, Response, NextFunction } from 'express';
import { loginService } from '../services/authService';
import prisma from '../config/db';
import { User } from '@prisma/client';
import { generateAuthToken } from '../utils/jwt';

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    let { loginType } = req.body;

    if (!loginType) {
      const origin = req.headers.origin || req.hostname || '';
      if (origin.includes('backoffice.kerjadiluar.id')) {
        loginType = 'backoffice';
      } else if (origin.includes('kerjadiluar.id')) {
        loginType = 'main';
      } else {
        res.status(400).json({
          success: false,
          message: 'Tidak dapat menentukan tipe login dari origin.'
        });
        return;
      }
    }

    const result = await loginService(email, password, loginType);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    next(error)
  }
};

export const googleLoginCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dbUser = req.user as User;

    const userWithRoles = await prisma.user.findUnique({
      where: { id: dbUser.id },
      include: { roles: { include: { role: true } } },
    });

    const roles = userWithRoles?.roles.map(r => r.role.name) || [];

    const token = generateAuthToken(dbUser.id, dbUser.name, roles);

    res.json({
      success: true,
      message: "Login dengan Google berhasil!",
      data: {
        token,
        user: {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          roles,
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const googleLoginFailed = (req: Request, res: Response) => {
  res.status(401).json({ success: false, message: 'Login dengan Google gagal.' });
};