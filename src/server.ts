import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

const port: number = Number(process.env.PORT ?? '8000');
const baseUrl: string = process.env.BASE_URL ?? 'http://localhost';

app.use(cors());
app.use(express.json());

app.get('/api/ping', (req: Request, res: Response) => {
  res.json({ message: 'pong!' });
});

app.listen(port, () => {
  console.log(`Server is running on ${baseUrl}:${port}`);
});