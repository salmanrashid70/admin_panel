import { CustomError } from "@/types/ApiError";
import { AxiosError } from "axios";

export const handleApiError = (error: unknown): CustomError => {

  // Check if error is an AxiosError
  if (error instanceof AxiosError) {
    console.log(error.response);
    const status = error.response?.status || 500; // Default to 500 if no status
    const responseData = error.response?.data || {};

    // Base error structure
    const baseError: CustomError = {
      message: responseData?.message || "An unexpected error occurred",
      statusCode: status,
      code: responseData?.code || status.toString(),
      validationErrors: responseData?.validationErrors || {},
      originalError: error,
    };

    // Handle specific status codes
    switch (status) {
      case 400:
        return {
          ...baseError,
          message: responseData?.message || "Invalid request",
          validationErrors: responseData?.validationErrors || {},
        };
      case 401:
        return {
          ...baseError,
          message: responseData?.message || "Unauthorized - Please log in again",
        };
      case 403:
        return {
          ...baseError,
          message: responseData?.message || "You do not have permission to perform this action",
        };
      case 404:
        return {
          ...baseError,
          message: responseData?.message || "Resource not found",
        };
      case 429:
        return {
          ...baseError,
          message: responseData?.message || "Too many requests - please try again later",
        };
      case 500:
        return {
          ...baseError,
          message: responseData?.message || "Internal server error - please try again later",
        };
      default:
        return baseError;
    }
  }

  // Handle network errors explicitly
  if (error instanceof Error && error.message === "Network Error") {
    return {
      message: "Network error - please check your internet connection",
      statusCode: 0, // No HTTP response
      originalError: error,
    };
  }

  // Fallback for unknown errors
  return {
    message: "An unexpected error occurred",
    statusCode: 500,
    originalError: error,
  };
};

