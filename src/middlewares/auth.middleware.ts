import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import prisma from '../config/db';

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token tidak ditemukan atau format salah.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    
    if (!decoded.sessionId) {
      res.status(401).json({ message: 'Payload token tidak valid.' });
      return;
    }

    const session = await prisma.userSession.findFirst({
      where: {
        id: decoded.sessionId,
        revoked_at: null,
      },
      include: {
        user: {
          include: {
            roles: {
              select: {
                role: {
                  select: { name: true }
                }
              }
            }
          }
        }
      }
    });

    if (!session || !session.user) {
      res.status(401).json({ message: 'Sesi tidak valid atau telah berakhir.' });
      return;
    }
    
    if (new Date() > session.expires_at) {
      res.status(401).json({ message: 'Sesi telah kedaluwarsa.' });
      return;
    }

    (req as any).user = {
      id: session.user.id,
      name: session.user.name,
      roles: session.user.roles.map(r => r.role.name.toLowerCase()),
      sessionId: session.id
    };
    
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
