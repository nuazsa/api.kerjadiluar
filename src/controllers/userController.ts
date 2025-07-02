import { NextFunction, Request, Response } from 'express';
import { getUsers } from '../services/userService';

export const getUsersHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roleId, name } = req.query;

    const users = await getUsers({
      roleId: roleId as string | undefined,
      name: name as string | undefined,
    });

    res.json({ 
      success: true, 
      message: 'Berhasil mendapatkan data user',
      data: users 
    });
  } catch (error: any) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      res.status(400).json({ message: 'User ID is required' });
      return;
    }

    const users = await getUsers({ roleId: undefined, name: undefined });
    const user = users.find(u => u.id === userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ 
      success: true,
      message: 'Berhasil mendapatkan data user',
      data: user 
    });
  } catch (error: any) {
    next(error);
  }
}