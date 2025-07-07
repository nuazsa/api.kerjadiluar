import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport';
import { errorHandler } from './middlewares/error.handler';
import profileRoutes from './routes/profile.route';
import userRoutes from './routes/user.route';
import authRoutes from './routes/auth.route';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const app: Application = express();

const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yml'));

const swaggerOptions = {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.js'
  ]
};

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

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Selamat Datang di API Kerjadiluar',
    version: '1.0.0',
    documentation: '/api-docs',
    author: 'kerjadiluar.id'
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

app.use('/api/profile', profileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/api/ping', (req: Request, res: Response) => {
  res.json({ message: 'pong!' });
});

app.use(errorHandler);

export default app;