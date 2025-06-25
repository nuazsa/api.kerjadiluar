import { NextFunction, Request, Response } from 'express';
import { createUser, getAllUsers } from '../services/userService';

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

export const listUsers = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error: any) {
    next(error);
  }
};