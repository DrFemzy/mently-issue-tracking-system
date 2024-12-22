import { z } from "zod";

export const createUserValidator = z.object({
  _id: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginUserValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const changeUserRoleValidator = z.object({
  role: z.string(),
});
