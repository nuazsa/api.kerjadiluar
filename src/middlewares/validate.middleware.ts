import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export const validate = (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.body = parsed.body;
      Object.assign(req.query, parsed.query);
      Object.assign(req.params, parsed.params);
      next();
    } catch (error) {
      next(error);
    }
};
