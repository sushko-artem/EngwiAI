/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useSignIn } from "./useSignIn";
import { useLoginMutation } from "@features/auth";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";

vi.mock("formik");
vi.mock("react-router-dom");
vi.mock("@features/auth");

describe("useSignIn", () => {
  it("should init with empty form", () => {
    vi.mocked(useLoginMutation).mockReturnValue([
      vi.fn(),
      { reset: vi.fn(), isLoading: false },
    ]);

    vi.mocked(useFormik).mockReturnValue({
      values: { email: "", password: "" },
    } as unknown as ReturnType<typeof useFormik>);

    const { result } = renderHook(() => useSignIn());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.formik.values.email).toBe("");
    expect(result.current.formik.values.password).toBe("");
  });

  it("should redirect to dashboard when login successful", async () => {
    const mockLogin = vi.fn().mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({}),
    });

    vi.mocked(useLoginMutation).mockReturnValue([
      mockLogin,
      { isLoading: false, reset: vi.fn() },
    ]);

    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    let capturedOnSubmit: any;

    vi.mocked(useFormik).mockImplementation((config) => {
      capturedOnSubmit = config.onSubmit;

      return {
        values: { email: "", password: "" },
      } as any;
    });

    renderHook(() => useSignIn());

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
    const mockLogin = vi.fn().mockReturnValue({
      unwrap: vi.fn().mockRejectedValue({
        status: 401,
        data: {
          error: "password",
          message: "Invalid password",
        },
      }),
    });

    vi.mocked(useLoginMutation).mockReturnValue([
      mockLogin,
      { isLoading: false, reset: vi.fn() },
    ]);

    const mockSetErrors = vi.fn();
    let capturedOnSubmit: any;

    vi.mocked(useFormik).mockImplementation((config) => {
      capturedOnSubmit = config.onSubmit;
      return {
        values: { email: "", password: "" },
        setErrors: mockSetErrors,
      } as any;
    });

    renderHook(() => useSignIn());

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
    const mockLogin = vi.fn().mockReturnValue({
      unwrap: vi.fn().mockRejectedValue(new Error("Network error")),
    });
    vi.mocked(useLoginMutation).mockReturnValue([
      mockLogin,
      { isLoading: false, reset: vi.fn() },
    ]);
    const mockSetStatus = vi.fn();
    let capturedOnSubmit: any;

    vi.mocked(useFormik).mockImplementation((config) => {
      capturedOnSubmit = config.onSubmit;
      return {
        values: { email: "", password: "" },
        setStatus: mockSetStatus,
      } as any;
    });

    renderHook(() => useSignIn());

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
