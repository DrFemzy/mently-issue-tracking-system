import commentService from ".";
import ServiceDecorator from "../../decorators";
import respond from "../../utils/respond";
import {
  createCommentValidator,
  getCommentsValidator,
} from "../../validators/comment";
import { Request, Response } from "express";

export class CommentController {
  constructor() {}

  @ServiceDecorator.forRequestPayloadValidation(createCommentValidator)
  @ServiceDecorator.forCatchingErrorAndSendingToClient()
  async createComment(req: Request, res: Response) {
    const { comment, issue } = req.body;

    const response = await commentService.createComment({
      comment,
      issue,
      user: req.userId,
    });

    return respond(res, {
      status: "success",
      statusCode: response.code,
      message: response.message,
      data: response.comment,
    });
  }

  @ServiceDecorator.forCatchingErrorAndSendingToClient()
  @ServiceDecorator.forRequestPayloadValidation(getCommentsValidator)
  async getComments(req: Request, res: Response) {
    const { page = 1, limit = 10, user, search, issue } = req.body;

    const filter: any = {};

    if (issue) filter.issue = issue;
    if (user) filter.user = user;
    if (search) {
      filter.comment = { $regex: search, $options: "i" };
    }

    const response = await commentService.getComments(filter, page, limit);

    return respond(res, {
      status: "success",
      statusCode: response.code,
      message: response.message,
      data: response.comments,
    });
  }
}

const commentController = new CommentController();
export default commentController;
