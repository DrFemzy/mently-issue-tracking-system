import { Router } from "express";
import userController from "./controller";
import { validateTokenAndRole } from "../../middleware";

const userRouter = Router();

userRouter.post("/sign-up", userController.signUp);
userRouter.post("/sign-in", userController.signIn);
userRouter.get("/refresh", userController.refreshToken);

userRouter.use(validateTokenAndRole(["ADMIN"]));
userRouter.post("/role/:id", userController.updateUserRole);

export default userRouter;