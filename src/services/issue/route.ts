import { Router } from "express";
import issueController from "./controller";
import { validateTokenAndRole } from "../../middleware";

const issueRouter = Router();

issueRouter.use(validateTokenAndRole());
issueRouter.post("/get", issueController.getIssues);
issueRouter.patch("/:issueId", issueController.updateIssue);

issueRouter.use(validateTokenAndRole(["PROJECT-MANAGER", "ADMIN"]));
issueRouter.post("/", issueController.createIssue);
issueRouter.patch("/:issueId/assign", issueController.assignIssue);

export default issueRouter