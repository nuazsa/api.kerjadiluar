import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const baseUrl = process.env.BASE_URL || 'http://localhost';
const endpoint = `${baseUrl}:${port}`;

app.use(cors());
app.use(express.json());

app.get('/api/ping', (req, res) => {
  res.json({
    message: 'pong!',
  });
});

app.listen(port, () => {
  console.log(`API running on ${endpoint}`);
});
