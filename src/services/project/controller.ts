import projectService from ".";
import ServiceDecorator from "../../decorators";
import respond from "../../utils/respond";
import { Response, Request } from "express";
import { createProjectValidator } from "../../validators/project";

export class ProjectController {
  constructor() {}

  @ServiceDecorator.forRequestPayloadValidation(createProjectValidator)
  @ServiceDecorator.forCatchingErrorAndSendingToClient()
  async upsertProject(req: Request, res: Response) {
    const { name, description, projectId } = req.body;

    if (projectId) {
      const response = await projectService.updateProject(projectId, {
        name,
        description,
      });

      return respond(res, {
        status: "success",
        statusCode: response.code,
        message: response.message,
        data: response.updatedProject,
      });
    }

    const response = await projectService.createProject({
      name,
      description,
      createdBy: req.userId!,
    });

    return respond(res, {
      status: "success",
      statusCode: response.code,
      message: response.message,
      data: response.project,
    });
  }

  @ServiceDecorator.forCatchingErrorAndSendingToClient()
  async getAllProjects(req: Request, res: Response) {
    const response = await projectService.getAllProjects();

    return respond(res, {
      status: "success",
      statusCode: response.code,
      message: response.message,
      data: response.projects,
    });
  }

  @ServiceDecorator.forCatchingErrorAndSendingToClient()
  async deleteProject(req: Request, res: Response) {
    const { projectId } = req.params;

    const response = await projectService.deleteProject(projectId);

    return respond(res, {
      status: "success",
      statusCode: response.code,
      message: response.message,
    });
  }
}

const projectController = new ProjectController();
export default projectController;
