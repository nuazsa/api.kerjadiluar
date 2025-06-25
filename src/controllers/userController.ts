import { NextFunction, Request, Response } from 'express';
import { createUser, getUsers } from '../services/userService';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, roleId } = req.body;

    if (!name || !email || !password || !roleId) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const user = await createUser(name, email, password, roleId);
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json(userWithoutPassword);
  } catch (error: any) {
    next(error);
  }
};

export const getUsersHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roleId, name } = req.query;

    const users = await getUsers({
      roleId: roleId as string | undefined,
      name: name as string | undefined,
    });

    res.json({ success: true, data: users });
  } catch (error: any) {
    next(error);
  }
};