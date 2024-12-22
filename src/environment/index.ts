import { config } from "dotenv";

config();

export const environment = (process.env.NODE_ENV ?? "development") as
  | "production"
  | "development"
  | "staging"
  | "test";
console.log({ environment });

export const PORT = process.env.PORT ?? 5000;
export const MONGO_DB_CONNECTION_STRING = process.env
  .MONGO_DB_CONNECTION_STRING as string;

export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
