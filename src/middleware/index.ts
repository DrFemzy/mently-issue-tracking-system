import { NextFunction, Request, Response } from "express";
import respond from "../utils/respond";
import userService from "../services/user";

export function validateTokenAndRole(ROLES?: string[]) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers?.authorization;

    if (req.path.includes("wr")) return next();

    if (!authHeader?.startsWith("Bearer")) {
      return respond(res, {
        status: "error",
        statusCode: 400,
        message: "Authorization Header must begin with the word `Bearer` ",
        data: null,
      });
    }

    const token = authHeader.split(" ")?.[1];

    if (!token) {
      return respond(res, {
        status: "error",
        statusCode: 400,
        message: "Token missing ",
        data: null,
      });
    }

    try {
      const validatedToken = await userService.verifyAccessToken(token);
      if (!validatedToken) {
        return respond(res, {
          status: "error",
          statusCode: 401,
          message: "Invalid token",
          data: null,
        });
      } else {
        req.userId = validatedToken.id;
        req.username = validatedToken.name
        if (ROLES && !ROLES.includes(validatedToken.role)) {
          console.log({ role: validatedToken.role, ROLES });
          return respond(res, {
            status: "error",
            statusCode: 403,
            message: "You are not authorized to perform this action",
            data: null,
          });
        }
      }
    } catch (e: any) {
      console.log({ e });
      return respond(res, {
        status: "error",
        statusCode: 401,
        message: e.message ?? "Invalid token",
        data: null,
      });
    }

    next();
  };
}
