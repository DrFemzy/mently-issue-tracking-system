import { ContextNames } from "../services/user";

export class AppError extends Error {
  constructor(error: string, code: number, data?: any) {
    const payload: ErrorInterfce = {
      code,
      value: error,
      data,
    };

    super(JSON.stringify(payload) as any);
  }
}

export const FORBIDDEN_ACTION_ERROR =
  "This operation is beyond the scope of your privileges";

export interface ErrorInterfce {
  code: number;
  value: string;
  data?: any;
}
