import { Router } from 'express';
import passport from '../config/passport';
import { validate } from '../middlewares/validate.middleware';
import { loginUserSchema, registerUserSchema } from '../validations/auth.validation';
import { getMe, googleLoginCallback, googleLoginFailed, loginUser, registerUser, logoutUser } from '../controllers/auth.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', validate(loginUserSchema), loginUser);

router.post('/register', validate(registerUserSchema), registerUser);

router.delete('/logout', verifyJWT, logoutUser);

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

router.get('/me', verifyJWT, getMe);

router.get('/login-failed', googleLoginFailed);

export default router;