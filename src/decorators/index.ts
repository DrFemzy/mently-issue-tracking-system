import { Request, Response } from "express";
import { z } from "zod";
import { environment } from "../environment";
import respond from "../utils/respond";
import { UserRepository } from "../services/user/repository";
import { ContextNames } from "../services/user";
import { AppError } from "../utils/error";

abstract class ServiceDecorator {
  static forRequestPayloadValidation(
    validator: z.ZodObject<any> | z.ZodIntersection<any, any>,
    type?: "body" | "params" | "query",
    property?: string,
    stringified?: boolean
  ) {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;

      descriptor.value = async function (...args: [Request, Response]) {
        const [request, response] = args;

        if (
          response.locals.skipDecoratorCheck &&
          environment !== "production"
        ) {
          const result = await originalMethod.apply(this, args);
          return result;
        }

        try {
          let payload = request[type ?? "body"] ?? request;

          const { error } = validator.parse(payload);
          if (!request.body && error) {
            return console.error(error.message);
          }

          const result = await originalMethod.apply(this, args);
          return result;
        } catch (e) {
          if (e instanceof z.ZodError) {
            const msg = JSON.parse(e.message) as any;

            return respond(response, {
              status: "error",
              statusCode: 400,
              message: `${msg[0].path[0]}: ${msg[0].message} `,
            });
          }

          console.error(e);
        }
      };
    };
  }

  static forAuthorizingOperationByRole(
    role: ContextNames,
    userRepository: UserRepository,
    strict?: boolean
  ) {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;
    };
  }

  static forCatchingErrorAndSendingToClient() {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const originalValue = descriptor?.value;
      descriptor.value = async function (...args: [Request, Response]) {
        const [request, response] = args;

        if (
          response.locals.skipDecoratorCheck &&
          environment !== "production"
        ) {
          const result = await originalValue.apply(this, args);
          return result;
        }

        if (
          response.locals.skipDecoratorCheck &&
          environment !== "production"
        ) {
          const result = await originalValue.apply(this, args);
          return result;
        }

        try {
          const result = await originalValue.apply(this, args);
          return result;
        } catch (e: any) {
          if (e instanceof AppError) {
            const payload = JSON.parse(e.message as any);
            return respond(response, {
              status: "error",
              statusCode: payload.code,
              message: payload.value,
              data: payload?.data ?? undefined,
            });
          }
          console.error(e);
          throw new Error(e.message);
        }
      };

      // return descriptor;
    };
  }
}

export default ServiceDecorator;
