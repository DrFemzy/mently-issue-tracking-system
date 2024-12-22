import { Request, Response } from "express";
import ServiceDecorator from "../../decorators";
import {
  changeUserRoleValidator,
  createUserValidator,
  loginUserValidator,
} from "../../validators/user";
import userService from ".";
import respond from "../../utils/respond";
import userRepository from "./repository";
import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "../../environment";
import { AppError } from "../../utils/error";

class UserController {
  constructor() {}

  @ServiceDecorator.forRequestPayloadValidation(createUserValidator)
  @ServiceDecorator.forCatchingErrorAndSendingToClient()
  async signUp(req: Request, res: Response) {
    const user = { ...req.body, role: "DEVELOPER" };

    try {
      const response = await userService.register(user);

      return respond(res, {
        statusCode: 200,
        status: "success",
        message: response.message ?? "Registration successful",
      });
    } catch (e: any) {
      const payload = JSON.parse(e.message as any);
      return respond(res, {
        statusCode: payload.code ?? 400,
        status: "error",
        message: payload.value,
      });
    }
  }

  @ServiceDecorator.forRequestPayloadValidation(loginUserValidator)
  @ServiceDecorator.forCatchingErrorAndSendingToClient()
  async signIn(req: Request, res: Response) {
    const cookies = req.cookies;
    console.log(`cookie available at login: ${JSON.stringify(cookies)}`);

    const { email, password } = req.body;

    if (!email || !password)
      return respond(res, {
        status: "error",
        statusCode: 400,
        message: "Email and password are required.",
      });

    const response = await userService.login(
      { email, password },
      res,
      cookies?.jwt
    );

    return respond(res, {
      status: "success",
      statusCode: response.code,
      message: response.message,
      data: { user: response.user, accessToken: response.accessToken },
    });
  }

  @ServiceDecorator.forCatchingErrorAndSendingToClient()
  async refreshToken(req: Request, res: Response) {
    const cookies = req.cookies;
    if (!cookies?.jwt)
      return respond(res, { statusCode: 401, status: "error" });
    const refreshToken = cookies.jwt;
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });

    const foundUser = await userRepository.findUser({
      refreshToken: refreshToken as unknown as string[],
    });

    // Detected refresh token reuse!
    if (!foundUser) {
      jwt.verify(
        refreshToken,
        REFRESH_TOKEN_SECRET,
        async (err: any, decoded: any) => {
          if (err)
            return respond(res, {
              statusCode: 403,
              status: "error",
              message: "Forbidden",
            }); //Forbidden
          console.log("attempted refresh token reuse!");
          const hackedUser = await userRepository.findUserByEmail(
            decoded!.email
          );
          hackedUser!.refreshToken = [];
          const result = await hackedUser?.save();
          console.log(result);
        }
      );
      return respond(res, {
        status: "error",
        statusCode: 403,
        message: "Forbidden",
      }); //Forbidden
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(
      (rt) => rt !== refreshToken
    );

    // evaluate jwt
    jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET,
      async (err: any, decoded: any) => {
        if (err) {
          console.log("expired refresh token");
          foundUser.refreshToken = [...newRefreshTokenArray];
          const result = await foundUser.save();
          console.log(result);
        }
        if (err || foundUser.email !== decoded!.email)
          return respond(res, {
            statusCode: 403,
            message: "Forbidden",
            status: "error",
          });

        const accessToken = await userService.generateAccessToken(foundUser);

        const newRefreshToken = await userService.generateRefreshToken(
          foundUser
        );
        // Saving refreshToken with current user
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();

        // Creates Secure Cookie with refresh token
        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        return respond(res, {
          statusCode: 200,
          message: "User refreshed",
          status: "success",
          data: accessToken,
        });
      }
    );
  }

  @ServiceDecorator.forRequestPayloadValidation(changeUserRoleValidator)
  @ServiceDecorator.forCatchingErrorAndSendingToClient()
  async updateUserRole(req: Request, res: Response) {
    const { id } = req.params;
    const { role } = req.body;

    const response = await userService.updateUserRole({ _id: id, role });
    console.log({ response });
    return respond(res, {
      status: "success",
      statusCode: response.code,
      message: response.message,
      data: response.updatedUser,
    });
  }
}

const userController = new UserController();
export default userController;
