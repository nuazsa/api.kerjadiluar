import { Router } from 'express';
import { registerUser, getUsersHandler, getUserById } from '../controllers/userController';
import { validate } from '../middlewares/validate.middleware';
import { registerUserSchema, loginUserSchema } from '../validations/user.validation';
import { loginUser } from '../controllers/authController';
// import { verifyJWT, allowRoles, disallowRoles } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', validate(registerUserSchema), registerUser);

router.post('/login', validate(loginUserSchema), loginUser);

// Endpoint untuk mendapatkan semua data user.
// Middleware otentikasi (verifyJWT) dan otorisasi (allowRoles) dinonaktifkan sementara.
// Harusnya: hanya untuk admin dan manajer
router.get('/', /* verifyJWT, allowRoles('admin', 'manajer'), */ getUsersHandler);

// Endpoint untuk mendapatkan data satu user berdasarkan ID.
// Middleware otentikasi (verifyJWT) dan otorisasi (disallowRoles) dinonaktifkan sementara.
// Harusnya: hanya untuk selain admin dan manajer
router.get('/:id', /* verifyJWT, disallowRoles('admin', 'manajer'), */ getUserById);

export default router;