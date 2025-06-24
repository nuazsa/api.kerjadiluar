import { Router } from 'express';
import { registerUser, listUsers } from '../controllers/userController';

const router = Router();

router.post('/register', registerUser);
router.get('/', listUsers);

export default router;
