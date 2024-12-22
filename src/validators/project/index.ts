import { z } from "zod";

export const createProjectValidator = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1),
    projectId: z.string().optional(),
  })
  .strict();
