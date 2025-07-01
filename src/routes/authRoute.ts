import { Router } from 'express';
import passport from '../config/passport';
import { validate } from '../middlewares/validate.middleware';
import { loginUserSchema } from '../validations/user.validation';
import { googleLoginCallback, googleLoginFailed, loginUser } from '../controllers/authController';

const router = Router();

router.post('/login', validate(loginUserSchema), loginUser);

router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/login-failed',
    session: false,
  }),
  googleLoginCallback
);

router.get('/login-failed', googleLoginFailed);

export default router;