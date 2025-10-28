import { type FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}

export function getErrorMessage(error: unknown): string {
  if (isFetchBaseQueryError(error)) {
    const errorData = error.data as string | { message: string };
    return typeof errorData === "string"
      ? errorData
      : errorData?.message || "Неизвестная ошибка";
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Неизвестная ошибка";
}
