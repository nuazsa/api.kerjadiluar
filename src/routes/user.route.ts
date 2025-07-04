import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import {
  getUsersSchema,
  userPathParamsSchema,
  updateUserSchema
} from '../validations/user.validation';
import { 
  getUsersHandler, 
  getUserById, 
  updateUserHandler, 
  deleteUserHandler 
} from '../controllers/user.controller';

// import { verifyJWT, allowRoles, disallowRoles } from '../middlewares/authMiddleware';

const router = Router();

// Endpoint untuk mendapatkan semua data user.
// Middleware otentikasi (verifyJWT) dan otorisasi (allowRoles) dinonaktifkan sementara.
// Harusnya: hanya untuk admin dan manajer
router.get('/', validate(getUsersSchema), /* verifyJWT, allowRoles('admin', 'manajer'), */ getUsersHandler);

// Endpoint untuk mendapatkan data satu user berdasarkan ID.
// Middleware otentikasi (verifyJWT) dan otorisasi (disallowRoles) dinonaktifkan sementara.
// Harusnya: hanya untuk selain admin dan manajer
router.get('/:id', validate(userPathParamsSchema), /* verifyJWT, disallowRoles('admin', 'manajer'), */ getUserById);
router.put('/:id', validate(updateUserSchema), updateUserHandler);
router.delete('/:id', validate(userPathParamsSchema), deleteUserHandler);

export default router;