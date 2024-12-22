import { Router } from "express";
import projectController from "./controller";
import { validateTokenAndRole } from "../../middleware";

const projectRouter = Router();


projectRouter.use(validateTokenAndRole(["ADMIN", "PROJECT-MANAGER"]));
projectRouter.post("/", projectController.upsertProject);
projectRouter.get("/", projectController.getAllProjects);

projectRouter.use(validateTokenAndRole(["ADMIN"]));
projectRouter.delete("/:projectId", projectController.deleteProject);

export default projectRouter;
