import { describe, expect, it } from "vitest";
import { getErrorMessage, isFetchBaseQueryError } from "./helpers";

describe("isFetchBaseQueryError", () => {
  it("should return true for RTK Query error object", () => {
    expect(isFetchBaseQueryError({ status: 400, data: "error" })).toBe(true);
    expect(isFetchBaseQueryError({ status: 500 })).toBe(true);
  });

  it("should return false for non-errors", () => {
    expect(isFetchBaseQueryError(null)).toBe(false);
    expect(isFetchBaseQueryError(new Error())).toBe(false);
    expect(isFetchBaseQueryError("string")).toBe(false);
  });
});

describe("getErrorMessage", () => {
  it("should extract message from FetchBaseQueryError with string data", () => {
    const error = { status: 400, data: "Email required" };
    expect(getErrorMessage(error)).toBe("Email required");
  });

  it("should extract message from FetchBaseQueryError with object data", () => {
    const error = {
      status: 409,
      data: { message: "User already exists" },
    };
    expect(getErrorMessage(error)).toBe("User already exists");
  });

  it("should handle error instance", () => {
    const error = new Error("Network failed");
    expect(getErrorMessage(error)).toBe("Network failed");
  });

  it("should handle string errors", () => {
    expect(getErrorMessage("something wrong")).toBe("something wrong");
  });

  it("should return default message for unknown errors", () => {
    expect(getErrorMessage({})).toBe("Неизвестная ошибка");
    expect(getErrorMessage(null)).toBe("Неизвестная ошибка");
  });
});
