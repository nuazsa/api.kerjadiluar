import { Router } from 'express';
import { 
  getUsersHandler, 
  getUserById, 
  updateUserHandler, 
  deleteUserHandler 
} from '../controllers/userController';
// import { verifyJWT, allowRoles, disallowRoles } from '../middlewares/authMiddleware';

const router = Router();

// Endpoint untuk mendapatkan semua data user.
// Middleware otentikasi (verifyJWT) dan otorisasi (allowRoles) dinonaktifkan sementara.
// Harusnya: hanya untuk admin dan manajer
router.get('/', /* verifyJWT, allowRoles('admin', 'manajer'), */ getUsersHandler);

// Endpoint untuk mendapatkan data satu user berdasarkan ID.
// Middleware otentikasi (verifyJWT) dan otorisasi (disallowRoles) dinonaktifkan sementara.
// Harusnya: hanya untuk selain admin dan manajer
router.get('/:id', /* verifyJWT, disallowRoles('admin', 'manajer'), */ getUserById);
router.put('/:id', updateUserHandler);
router.delete('/:id', deleteUserHandler);

export default router;