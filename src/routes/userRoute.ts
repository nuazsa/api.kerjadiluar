import { Router } from 'express';
import { registerUser, listUsers } from '../controllers/userController';
import { validate } from '../middlewares/validate.middleware';
import { registerUserSchema } from '../validations/user.validation';

const router = Router();

router.post('/register', validate(registerUserSchema), registerUser);
router.get('/', listUsers);

export default router;