import { Router } from 'express';
import { registerUser, getUsersHandler } from '../controllers/userController';
import { validate } from '../middlewares/validate.middleware';
import { registerUserSchema } from '../validations/user.validation';

const router = Router();

router.post('/register', validate(registerUserSchema), registerUser);
router.get('/', getUsersHandler);

export default router;