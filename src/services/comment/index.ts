import { AppError } from "../../utils/error";
import { IComment } from "./model";
import commentRepository from "./repository";

export class CommentService {
  constructor() {}

  async createComment(payload: Partial<IComment>) {
    try {
      const existingComment = await commentRepository.findComment({
        ...(payload as any),
      });

      if (existingComment) throw new AppError("Comment already exist", 400);

      const comment = await commentRepository.createComment(payload);

      return {
        status: true,
        code: 201,
        message: "Comment created successfully",
        comment,
      };
    } catch (e: any) {
      throw new AppError(e.message ?? "Error creating comment", 400);
    }
  }

  async getComments(
    filters: { comment?: string; user?: string; issue?: string },
    page: number,
    limit: number
  ) {
    const comments = await commentRepository.getComments(filters, page, limit);

    return {
      status: true,
      code: 200,
      message: "Comment retrieved successfully",
      comments,
    };
  }
}

const commentService = new CommentService()
export default commentService