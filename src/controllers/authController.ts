import { Request, Response, NextFunction } from 'express';
import { loginService } from '../services/authService';

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
