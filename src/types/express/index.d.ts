// to make the file a module and avoid the TypeScript error
import "express";

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
      username?: string;
    }
    export interface Response {
      locals: {
        skipDecoratorCheck?: boolean;
      };
    }
  }
}
