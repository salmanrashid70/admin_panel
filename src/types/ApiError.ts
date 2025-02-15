export interface CustomError {
  message: string;
  statusCode?: number;
  code?: string;
  validationErrors?: Record<string, string>;
  originalError: unknown;
}