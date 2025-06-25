import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Data yang diberikan tidak valid.',
        details: err.flatten().fieldErrors,
      },
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const field = (err.meta?.target as string[])?.[0] || 'field';
      res.status(409).json({
        success: false,
        error: {
          message: `Data untuk ${field} ini sudah digunakan. Silakan gunakan yang lain.`,
        },
      });
      return;
    }
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan pada server';

  res.status(statusCode).json({
    success: false,
    error: {
      message: message,
    },
  });
  return;
};