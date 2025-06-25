import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      const formatted: Record<string, string[]> = {};
      if (err.errors) {
        for (const error of err.errors) {
          const field = error.path[0];
          if (!formatted[field]) formatted[field] = [];
          formatted[field].push(error.message);
        }
      }

      res.status(400).json({
        success: false,
        error: {
          message: 'Data yang diberikan tidak valid.',
          details: formatted
        }
      });
    }
  };
