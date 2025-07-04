import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Token tidak ditemukan.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token tidak valid.' });
  }
};

export const allowRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoles = (req as any).user?.roles || [];

    const isAllowed = userRoles.some((r: string) => roles.includes(r));
    if (!isAllowed) {
      res.status(403).json({ message: 'Akses ditolak.' });
      return;
    }

    next();
  };
};

export const disallowRoles = (...blockedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoles = (req as any).user?.roles || [];

    const isBlocked = userRoles.some((r: string) => blockedRoles.includes(r));
    if (isBlocked) {
      res.status(403).json({ message: 'Akses ditolak untuk peran Anda.' });
      return;
    }

    next();
  };
};
