import { AppError } from "../../utils/error";
import Comment, { IComment } from "./model";

export class CommentRepository {
  constructor() {}

  async createComment(payload: Partial<IComment>): Promise<IComment> {
    const comment = await (
      await (await Comment.create(payload)).populate("user")
    ).populate("issue");
    return comment;
  }

  async findComment(payload: Partial<IComment>) {
    const comment = await Comment.findOne({ ...(payload as unknown as any) })
      .populate("user")
      .populate("issue")
      .exec();
    return comment;
  }

  async findCommentById(id: string): Promise<IComment | null> {
    const comment = await Comment.findById(id)
      .populate("user")
      .populate("issue")
      .exec();
    return comment;
  }

  async updateComment(
    id: string,
    payload: Partial<IComment>
  ): Promise<IComment | null> {
    const comment = await Comment.findByIdAndUpdate(id, payload, {
      new: true,
    })
      .populate("user")
      .populate("issue")
      .exec();
    return comment;
  }

  async getComments(
    filters: { issue?: string; user?: string; comment?: string },
    page: number,
    limit: number
  ): Promise<{
    paginationInfo: {
      page: number;
      limit: number;
      totalPages: number;
      total: number;
    };
    comments: IComment[];
  }> {
    try {
      const skip = (page - 1) * limit;
      const parsedLimit = parseInt(`${limit}`, 10);

      const comments = await Comment.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit)
        .populate("user")
        .populate("issue")
        .exec();

      const total = await Comment.countDocuments(filters);

      return {
        paginationInfo: {
          total,
          page: parseInt(`${page}`, 10),
          limit: parsedLimit,
          totalPages: Math.ceil(total / parsedLimit),
        },
        comments,
      };
    } catch (e: any) {
      throw new AppError(e?.message ?? "Error getting issues", 400);
    }
  }
}

const commentRepository = new CommentRepository();
export default commentRepository;
