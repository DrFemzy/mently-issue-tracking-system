import { AppError } from "../../utils/error";
import Issue, { IIssue } from "./model";

export class IssueRepository {
  constructor() {}

  async createIssue(payload: Partial<IIssue>): Promise<IIssue> {
    const issue = (
      await (
        await (await Issue.create(payload)).populate("project")
      ).populate("createdBy")
    ).populate("assignedTo");
    return issue;
  }

  async findIssue(payload: Partial<IIssue>) {
    const issue = await Issue.findOne({ ...(payload as unknown as any) })
      .populate("assignedTo")
      .populate("createdBy")
      .populate("project")
      .exec();
    return issue;
  }

  async findIssueById(id: string): Promise<IIssue | null> {
    const issue = await Issue.findById(id)
      .populate("assignedTo")
      .populate("createdBy")
      .populate("project")
      .exec();
    return issue;
  }

  async updateIssue(
    id: string,
    payload: Partial<IIssue>
  ): Promise<IIssue | null> {
    const issue = await Issue.findByIdAndUpdate(id, payload, {
      new: true,
    })
      .populate("assignedTo")
      .populate("createdBy")
      .populate("project")
      .exec();
    return issue;
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
  ): Promise<{
    paginationInfo: {
      page: number;
      limit: number;
      totalPages: number;
      total: number;
    };
    issues: IIssue[];
  }> {
    try {
      const skip = (page - 1) * limit;
      const parsedLimit = parseInt(`${limit}`, 10);

      const issues = await Issue.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .populate("assignedTo")
        .populate("createdBy")
        .populate("project");

      const total = await Issue.countDocuments(filters);

      return {
        paginationInfo: {
          total,
          page: parseInt(`${page}`, 10),
          limit: parsedLimit,
          totalPages: Math.ceil(total / parsedLimit),
        },
        issues,
      };
    } catch (e: any) {
      throw new AppError(e?.message ?? "Error getting issues", 400);
    }
  }
}

const issueRepository = new IssueRepository();
export default issueRepository;
