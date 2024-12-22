import { Router } from "express";
import { validateTokenAndRole } from "../../middleware";
import commentController from "./controller";

const commentRouter = Router();

commentRouter.use(validateTokenAndRole());
commentRouter.post("/", commentController.createComment);
commentRouter.get("/", commentController.getComments);

export default commentRouter;
