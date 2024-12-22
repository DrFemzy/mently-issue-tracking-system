import { z } from "zod";

export const createCommentValidator = z
  .object({
    comment: z.string().min(3),
    issue: z.string().min(1),
  })
  .strict();

export const getCommentsValidator = z
  .object({
    page: z.number().optional(),
    limit: z.number().optional(),
    user: z.string().optional(),
    issue: z.string().optional(),
    search: z.string().optional(),
  })
  .strict();
