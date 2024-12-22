import { unknown } from "zod";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../../environment";
import { AppError } from "../../utils/error";
import { IUser } from "./model";
import userRepository, { UserRepository } from "./repository";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Response } from "express";
import respond from "../../utils/respond";

export class UserService {
  constructor() {
    this.login = this.login.bind(this);
  }

  async register(user: IUser) {
    user.password = this.hashPassword(user.password);
    user.email = user.email.toLowerCase();

    const existingUser = await userRepository.findUserByEmail(user.email);

    if (existingUser) throw new AppError("User already exist", 400);

    const registeredUser = userRepository.createUser(user);

    return {
      status: true,
      code: 201,
      message: "Registration successful",
      user: registeredUser,
    };
  }

  async login(
    payload: LoginPayload,
    res: Response,
    existingJwtCookie?: string
  ) {
    const { email, password } = payload;
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      throw new AppError("Invalid login details", 400);
    } else {
      return user.matchPassword(password).then(async (isMatch) => {
        if (isMatch) {
          const newAccessToken = await this.generateAccessToken(user);
          const newRefreshToken = await this.generateRefreshToken(user);

          let newRefreshTokenArray = !existingJwtCookie
            ? user.refreshToken
            : user.refreshToken.filter((rt) => rt !== existingJwtCookie);

          if (existingJwtCookie) {
            const refreshToken = existingJwtCookie;
            const foundToken = await userRepository.findUser({
              refreshToken: refreshToken as unknown as string[],
            });

            if (!foundToken) {
              console.log("Attempted refresh token reuse at login!");
              newRefreshTokenArray = [];
            }

            res?.clearCookie("jwt", {
              httpOnly: true,
              sameSite: "none",
              secure: true,
            });
          }

          user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
          const result = await user.save();

          res?.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
          });

          return {
            status: true,
            code: 200,
            message: "Login successful",
            user: result,
            accessToken: newAccessToken,
          };
        } else {
          throw new AppError("Invalid Login Details here", 400);
        }
      });
    }
  }

  async updateUserRole(payload: Partial<IUser>) {
    const { _id: id, role } = payload;

    try {
      if (!id) throw new AppError("User not found", 404);

      const updatedUser = await userRepository.updateUser(id!, {
        role: role ?? "PROJECT-MANAGER",
      });

      return {
        status: true,
        code: 200,
        message: `User role updated to ${role}`,
        updatedUser,
      };
    } catch (err) {
      throw new AppError("User not found", 404);
    }
  }

  hashPassword(password: string) {
    const sha1 = crypto.createHash("sha1");
    sha1.update(password);
    return sha1.digest("hex");
  }

  async generateAccessToken(user: IUser) {
    return jwt.sign(
      {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        id: user._id,
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
  }
  async generateRefreshToken(user: IUser) {
    return jwt.sign(
      { email: user.email, role: user.role, id: user._id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
  }

  async verifyRefreshToken(refreshToken: string) {
    const foundUser = await userRepository.findUser({
      refreshToken: refreshToken as unknown as string[],
    });

    console.log({ foundUser });

    if (!foundUser) {
      // User
      jwt.verify(
        refreshToken,
        REFRESH_TOKEN_SECRET,
        async (error, decoded: any) => {
          if (error) throw new AppError("Unauthorized", 403);

          const hackedUser = await userRepository.findUserByEmail(
            decoded?.email
          );

          hackedUser!.refreshToken! = [];

          const result = await hackedUser?.save();

          console.log({ result });
        }
      );
      throw new AppError("Unauthorized", 403);
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(
      (rt) => rt !== refreshToken
    );

    // Token evaluation
    return jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET,
      async (err, decoded: any) => {
        if (err) {
          foundUser.refreshToken = [...newRefreshTokenArray];
          const result = await foundUser.save();
        }

        if (err || foundUser.email !== decoded?.email)
          throw new AppError("Unauthorized", 403);

        return foundUser;
      }
    );
  }

  async verifyAccessToken(accessToken: string) {
    const decoded = (await jwt.verify(
      accessToken,
      ACCESS_TOKEN_SECRET
    )) as unknown as { email: string; role: string; id: string, name: string } | undefined;
    return decoded;
  }
}

interface LoginPayload {
  email: string;
  password: string;
}

export type ContextNames = "ADMIN" | "PROJECT-MANAGER" | "DEVELOPER";

const userService = new UserService();
export default userService;
