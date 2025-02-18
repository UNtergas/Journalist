// import { config } from 'dotenv';

type EnvConfig = {
    JWT_SECRET: string;
    JWT_EXPIRE: string;
    COOKIE_EXPIRE: number;
  };
  
  const env: EnvConfig = process.env as never;
  
  export const CONFIG: typeof env = {
    JWT_SECRET: env.JWT_SECRET,
    JWT_EXPIRE: env.JWT_EXPIRE || "30d",
    COOKIE_EXPIRE: env.COOKIE_EXPIRE || 2592000000,
  };
  