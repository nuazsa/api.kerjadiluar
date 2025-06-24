import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  baseUrl: string;
}

const config: Config = {
  port: Number(process.env.PORT ?? '8000'),
  baseUrl: process.env.BASE_URL ?? 'http://localhost'
};

export default config;