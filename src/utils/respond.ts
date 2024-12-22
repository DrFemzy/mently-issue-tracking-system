import { Response } from "express";

export default function respond(res: Response, config: IConfig) {
  const { message, data, status, statusCode, token } = config;

  let _token = data?.token ?? token ?? res.locals.token;
  if (data?.token) data.token = undefined;

  res.status(statusCode);
  res.json({
    status,
    message: message,
    data,
    token: _token,
  });
}

interface IConfig {
  statusCode: number;
  data?: any;
  message?: string;
  status: "success" | "error";
  token?: string;
}
