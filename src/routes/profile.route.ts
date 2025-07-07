import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateProfileSchema } from '../validations/profile.validation';
import { getMyProfileHandler, updateMyProfileHandler } from '../controllers/profile.controller';

const router = Router();

router.use(verifyJWT);

router.get('/', getMyProfileHandler);
router.put('/', validate(updateProfileSchema), updateMyProfileHandler);

export default router;