import { Router } from "express";
import issueController from "./controller";
import { validateTokenAndRole } from "../../middleware";

const issueRouter = Router();

issueRouter.use(validateTokenAndRole());
issueRouter.get("/", issueController.getIssues);

issueRouter.use(validateTokenAndRole(["PROJECT-MANAGER", "ADMIN"]));
issueRouter.post("/", issueController.createIssue);
issueRouter.patch("/:issueId/assign", issueController.assignIssue);

issueRouter.use(validateTokenAndRole(["DEVELOPER"]));
issueRouter.patch("/:issueId", issueController.updateIssue);

export default issueRouter