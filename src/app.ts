import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import userRoutes from './routes/userRoute';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.get('/api/ping', (req: Request, res: Response) => {
  res.json({ message: 'pong!' });
});

app.use(errorHandler);

export default app;