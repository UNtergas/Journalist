// import { config } from 'dotenv';

type EnvConfig = {
  PORT: number;
  ENDPOINT: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRE: string;
  COOKIE_EXPIRE: number;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASSWORD: string;
  ENC_SECRET: string;
};

const env: EnvConfig = process.env as any;

export const CONFIG: typeof env = {
  PORT: Number(env.PORT) || 8080,
  ENDPOINT: env.ENDPOINT,
  DATABASE_URL: env.DATABASE_URL,
  JWT_SECRET: env.JWT_SECRET,
  JWT_EXPIRE: env.JWT_EXPIRE || "30d",
  COOKIE_EXPIRE: Number(env.COOKIE_EXPIRE) || 2592000000,
  SMTP_HOST: env.SMTP_HOST || 'smtp.ethereal.email',
  SMTP_PORT: Number(env.SMTP_PORT) || 587,
  SMTP_USER: env.SMTP_USER || 'johnny.dickinson@ethereal.email',
  SMTP_PASSWORD: env.SMTP_PASSWORD || 'P55cnzUYY2qNKDTFw4',
  ENC_SECRET: env.ENC_SECRET
};
