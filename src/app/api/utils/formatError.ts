import { CustomError } from "@/types/ApiError";
import { NextResponse } from "next/server";

const formatError = (message: string, statusCode: number, originalError: unknown, validationErrors?: Record<string, string>) => {
  const errorResponse: CustomError = {
    message,
    statusCode,
    code: statusCode.toString(), // Optional: You can add specific error codes
    validationErrors,
    originalError,
  };
  return NextResponse.json(errorResponse, { status: statusCode });
};

export default formatError;