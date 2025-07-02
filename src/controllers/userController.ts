import { NextFunction, Request, Response } from 'express';
import { deleteUser, getUsers, updateUser, getSingleUser } from '../services/userService';

export const getUsersHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getUsers(req.query);
    res.json({
      success: true,
      message: 'Berhasil mendapatkan data user',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getSingleUser(req.params.id);
    res.json({
      success: true,
      message: 'Berhasil mendapatkan data user',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'User berhasil diupdate',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteUser(req.params.id);
    res.status(200).json({
      success: true,
      message: 'User berhasil dihapus',
    });
  } catch (error) {
    next(error);
  }
};