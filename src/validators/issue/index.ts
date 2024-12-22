import { z } from "zod";

export const createIssueValidator = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    priority: z.enum(["Low", "Medium", "High"]),
    assignedTo: z.string().optional(),
    projectId: z.string().min(1),
  })
  .strict();

export const assignIssueValidator = z
  .object({
    assignedTo: z.string().min(1),
  })
  .strict();

export const updateIssueValidator = z.object({
  status: z.enum(["Open", "In Progress", "Closed"]).optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
});

export const getIssuesValidator = z
  .object({
    page: z.number().optional(),
    limit: z.number().optional(),
    status: z.enum(["Open", "In Progress", "Closed"]).optional(),
    assignedTo: z.string().optional(),
    priority: z.enum(["Low", "Medium", "High"]).optional(),
    search: z.string().optional(),
  })
  .strict();
