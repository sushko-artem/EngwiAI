import { describe, expect, it, vi } from "vitest";
import { act } from "@testing-library/react";
import { useSignIn } from "./useSignIn";
import { setupAuthHook } from "test/utils";

vi.mock("formik");
vi.mock("react-router-dom");
vi.mock("@features/auth");

describe("useSignIn", () => {
  it("should init with empty form", () => {
    const { result } = setupAuthHook(useSignIn);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.formik.values.email).toBe("");
    expect(result.current.formik.values.password).toBe("");
  });

  it("should redirect to dashboard when login successful", async () => {
    const {
      mockAction: mockLogin,
      mockNavigate,
      capturedOnSubmit,
    } = setupAuthHook(useSignIn);
    mockLogin.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({}),
    });

    await act(async () => {
      await capturedOnSubmit({
        email: "test@example.com",
        password: "password",
      });
    });

    expect(mockLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password",
    });
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { replace: true });
  });

  it("should set error on 401 error", async () => {
    const mockSetErrors = vi.fn();
    const { mockAction: mockLogin, capturedOnSubmit } = setupAuthHook(
      useSignIn,
      {
        formik: { setErrors: mockSetErrors },
      }
    );
    mockLogin.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue({
        status: 401,
        data: {
          error: "password",
          message: "Invalid password",
        },
      }),
    });

    await act(async () => {
      await capturedOnSubmit({
        email: "test@example.com",
        password: "wrong",
      });
    });

    expect(mockSetErrors).toHaveBeenCalledWith({
      password: "Invalid password",
    });
  });

  it("should set status on generic error", async () => {
    const mockSetStatus = vi.fn();
    const { mockAction: mockLogin, capturedOnSubmit } = setupAuthHook(
      useSignIn,
      {
        formik: { setStatus: mockSetStatus },
      }
    );
    mockLogin.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue(new Error("Network error")),
    });

    await act(async () => {
      await capturedOnSubmit({
        email: "test@example.com",
        password: "password",
      });
    });

    expect(mockSetStatus).toHaveBeenCalledWith({
      backendError: "Network error",
    });
  });
});
