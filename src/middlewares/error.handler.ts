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
    switch (err.code) {
      case 'P2002': {
        const field = (err.meta?.target as string[])?.[0] || 'field';
        res.status(409).json({
          success: false,
          error: {
            message: `Data untuk kolom '${field}' sudah ada. Silakan gunakan nilai lain.`,
          },
        });
        return;
      }
      case 'P2003': {
        const field = err.meta?.field_name || 'related field';
        res.status(400).json({
            success: false,
            error: {
                message: `Operasi gagal karena data terkait pada kolom '${field}' tidak ditemukan.`,
            }
        });
        return;
      }
      case 'P2011': {
        const field = (err.meta?.constraint as string)?.replace('_not_null', '') || 'field';
        res.status(400).json({
            success: false,
            error: {
                message: `Kolom '${field}' tidak boleh kosong.`,
            }
        });
        return;
      }
      case 'P2025': {
        res.status(404).json({
          success: false,
          error: {
            message: 'Sumber daya yang diminta tidak ditemukan.',
          },
        });
        return;
      }
      default: {
        res.status(400).json({
            success: false,
            error: {
                message: `Terjadi kesalahan pada database: ${err.message}`,
                code: err.code,
          }
        });
        return;
      }
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