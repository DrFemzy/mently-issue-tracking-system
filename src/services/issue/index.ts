import ServiceDecorator from "../../decorators";
import { AppError } from "../../utils/error";
import projectRepository from "../project/repository";
import { IIssue } from "./model";
import issueRepository from "./repository";

export class IssueService {
  constructor() {}

  async createIssue(payload: Partial<IIssue>) {
    // Check if project exist
    try {
      const project = await projectRepository.findProjectById(
        payload.project as string
      );
      if (!project) throw new AppError("Project not found", 400);

      // Check if issue exists
      const existingIssue = await issueRepository.findIssue({
        title: payload.title,
      });

      if (existingIssue) throw new AppError("Issue Already exist", 400);

      const issue = await issueRepository.createIssue(payload);

      return {
        status: true,
        code: 201,
        message: "Issue created successfully",
        issue,
      };
    } catch (e: any) {
      throw new AppError(e.message ?? "Something went wrong", 400);
    }
  }

  async getAllIssues(
    filters: {
      status?: string;
      asignedTo?: string;
      priority?: string;
      search?: string;
    },
    page: number,
    limit: number
  ) {
    const issues = await issueRepository.getAllIssues(filters, page, limit);

    return {
      status: true,
      code: 200,
      message: "Issues retrieved successfully",
      issues,
    };
  }

  async updateIssue(id: string, payload: Partial<IIssue>) {
    try {
      const issue = await issueRepository.findIssueById(id);
      if (!issue) throw new AppError("Issue not found", 404);

      const updatedIssue = await issueRepository.updateIssue(id, payload);

      return {
        status: true,
        code: 200,
        message: "Issue updated successfully",
        updatedIssue,
      };
    } catch (e: any) {
      throw new AppError(e.message ?? "Error updating issue", 400);
    }
  }
}

const issueService = new IssueService();
export default issueService;
