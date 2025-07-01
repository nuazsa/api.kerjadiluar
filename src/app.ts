import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport';
import { errorHandler } from './middlewares/errorHandler';
import userRoutes from './routes/userRoute';
import authRoutes from './routes/authRoute';

const app: Application = express();

app.use(cors());
app.use(express.json());

if (!process.env.SESSION_SECRET) {
  throw new Error('FATAL ERROR: SESSION_SECRET tidak diatur di environment variables.');
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/api/ping', (req: Request, res: Response) => {
  res.json({ message: 'pong!' });
});

app.use(errorHandler);

export default app;