import { Request, Response } from 'express';
import { createUser, getAllUsers } from '../services/userService';

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const user = await createUser(name, email, password);
  res.status(201).json(user);
};

export const listUsers = async (_: Request, res: Response) => {
  const users = await getAllUsers();
  res.json(users);
};