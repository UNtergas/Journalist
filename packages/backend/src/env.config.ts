// import { config } from 'dotenv';

type EnvConfig = {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRE: string;
  COOKIE_EXPIRE: number;
};

const env: EnvConfig = process.env as any;

export const CONFIG: typeof env = {
  PORT: env.PORT || 8080,
  DATABASE_URL: env.DATABASE_URL,
  JWT_SECRET: env.JWT_SECRET,
  JWT_EXPIRE: env.JWT_EXPIRE || "30d",
  COOKIE_EXPIRE: env.COOKIE_EXPIRE || 2592000000,
};
