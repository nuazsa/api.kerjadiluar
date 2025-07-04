import { Request, Response, NextFunction } from 'express';
import { createUser, loginService, logoutService, createSession } from '../services/auth.service';
import prisma from '../config/db';
import { User } from '@prisma/client';
import { generateAuthToken } from '../utils/jwt';
import { getSingleUser } from '../services/user.service';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, roleId } = req.body;

    const user = await createUser(name, email, password, roleId);

    res.status(201).json({
      success: true,
      message: 'User berhasil dibuat',
      data: user,
    });
  } catch (error: any) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    let { loginType } = req.body;

    if (!loginType) {
      const origin = req.headers.origin || '';
      if (origin.includes('backoffice.kerjadiluar.id') || origin.includes('backoffice-kerjadiluar.vercel.app')) {
        loginType = 'backoffice';
      } else {
        loginType = 'main';
      }
    }

    const meta = {
      user_agent: req.headers['user-agent'],
      ip_address: req.ip
    };

    const result = await loginService(email, password, loginType, meta);

    res.json({
      success: true,
      message: `Login berhasil sebagai ${result.user.name}`,
      data: result,
    });
  } catch (error: any) {
    next(error);
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

    const meta = { userAgent: req.headers['user-agent'], ipAddress: req.ip };
    const session = await createSession(dbUser.id, meta.userAgent, meta.ipAddress);

    const token = generateAuthToken(session.id);

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

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const user = await getSingleUser(userId);
    res.json({
      success: true,
      message: 'Berhasil mendapatkan data profil',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const googleLoginFailed = (req: Request, res: Response) => {
  res.status(401).json({ success: false, message: 'Login dengan Google gagal.' });
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionId = (req as any).user.sessionId;
        await logoutService(sessionId);
        res.status(200).json({
            success: true,
            message: 'Anda berhasil logout'
        });
    } catch (error) {
        next(error);
    }
}