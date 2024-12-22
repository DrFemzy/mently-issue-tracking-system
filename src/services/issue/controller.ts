import issueService from ".";
import ServiceDecorator from "../../decorators";
import respond from "../../utils/respond";
import {
  assignIssueValidator,
  createIssueValidator,
  getIssuesValidator,
} from "../../validators/issue";
import { Request, Response } from "express";

export class IssueController {
  constructor() {}

  @ServiceDecorator.forRequestPayloadValidation(createIssueValidator)
  @ServiceDecorator.forCatchingErrorAndSendingToClient()
  async createIssue(req: Request, res: Response) {
    const { title, description, priority, status, projectId } = req.body;

    const response = await issueService.createIssue({
      title,
      description,
      priority,
      createdBy: req.userId!,
      project: projectId,
      status: status ?? "Open",
    });

    return respond(res, {
      status: "success",
      statusCode: response.code,
      message: response.message,
      data: response.issue,
    });
  }

  @ServiceDecorator.forCatchingErrorAndSendingToClient()
  @ServiceDecorator.forRequestPayloadValidation(getIssuesValidator)
  async getIssues(req: Request, res: Response) {
    const {
      page = 1,
      limit = 10,
      status,
      assignedTo,
      priority,
      search,
    } = req.body;

    const filter: any = {};

    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (priority) filter.priority = priority;
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const response = await issueService.getAllIssues(filter, page, limit);

    return respond(res, {
      status: "success",
      statusCode: response.code,
      message: response.message,
      data: response.issues,
    });
  }

  @ServiceDecorator.forRequestPayloadValidation(updateIssue)
  @ServiceDecorator.forCatchingErrorAndSendingToClient()
  async updateIssue(req: Request, res: Response) {
    const { issueId } = req.params;
    const { title, description, project, assignedTo, priority, status } =
      req.body;

    const response = await issueService.updateIssue(issueId, {
      title,
      description,
      project,
      assignedTo,
      priority,
      status,
    });

    return respond(res, {
      status: "success",
      statusCode: response.code,
      message: response.message,
      data: response.updatedIssue,
    });
  }

  @ServiceDecorator.forRequestPayloadValidation(assignIssueValidator)
  @ServiceDecorator.forCatchingErrorAndSendingToClient()
  async assignIssue(req: Request, res: Response) {
    const { issueId } = req.params;
    const { assignedTo } = req.body;

    const response = await issueService.updateIssue(issueId, {
      assignedTo,
    });

    return respond(res, {
      status: "success",
      statusCode: response.code,
      message: response.message,
      data: response.updatedIssue,
    });
  }
}

const issueController = new IssueController();
export default issueController;
