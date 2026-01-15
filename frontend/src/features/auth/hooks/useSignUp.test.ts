/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSignUp } from "./useSignUp";
import { useRegisterMutation } from "@features/auth";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { act } from "react";

vi.mock("formik");
vi.mock("react-router-dom");
vi.mock("@features/auth");

describe("useSignUp", () => {
  it("should init with empty form", () => {
    vi.mocked(useRegisterMutation).mockReturnValue([
      vi.fn(),
      { reset: vi.fn(), isLoading: false },
    ]);

    vi.mocked(useFormik).mockReturnValue({
      values: { name: "", email: "", password: "", confirmPassword: "" },
    } as unknown as ReturnType<typeof useFormik>);

    const { result } = renderHook(() => useSignUp());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.formik.values.name).toBe("");
    expect(result.current.formik.values.email).toBe("");
    expect(result.current.formik.values.password).toBe("");
    expect(result.current.formik.values.confirmPassword).toBe("");
  });

  it("should redirect to sign-in when register successful", async () => {
    const mockRegister = vi.fn().mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({}),
    });

    vi.mocked(useRegisterMutation).mockReturnValue([
      mockRegister,
      { isLoading: false, reset: vi.fn() },
    ]);

    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    let capturedOnSubmit: any;

    vi.mocked(useFormik).mockImplementation((config) => {
      capturedOnSubmit = config.onSubmit;
      return {
        values: { name: "", email: "", password: "", confirmPassword: "" },
      } as any;
    });

    renderHook(() => useSignUp());

    await act(async () => {
      await capturedOnSubmit({
        name: "name",
        email: "test@mail.com",
        password: "password",
      });
    });

    expect(mockRegister).toHaveBeenCalledWith({
      name: "name",
      email: "test@mail.com",
      password: "password",
    });

    expect(mockNavigate).toHaveBeenCalledWith("/sign-in", { replace: true });
  });

  it("should set email error on 409 error", async () => {
    const mockRegister = vi.fn().mockReturnValue({
      unwrap: vi.fn().mockRejectedValue({
        status: 409,
        data: {
          error: "email",
          message: "user with this email already exist",
        },
      }),
    });

    vi.mocked(useRegisterMutation).mockReturnValue([
      mockRegister,
      { isLoading: false, reset: vi.fn() },
    ]);

    const mockSetErrors = vi.fn();
    let capturedOnSubmit: any;

    vi.mocked(useFormik).mockImplementation((config) => {
      capturedOnSubmit = config.onSubmit;
      return {
        values: { name: "", email: "", password: "", confirmPassword: "" },
        setErrors: mockSetErrors,
      } as any;
    });

    renderHook(() => useSignUp());

    await act(async () => {
      await capturedOnSubmit({
        name: "name",
        email: "test@mail.com",
        password: "password",
      });
    });

    expect(mockSetErrors).toHaveBeenCalledWith({
      email: "user with this email already exist",
    });
  });

  it("should set error on generic errors", async () => {
    const mockRegister = vi.fn().mockReturnValue({
      unwrap: vi.fn().mockRejectedValue(new Error("Network error")),
    });

    vi.mocked(useRegisterMutation).mockReturnValue([
      mockRegister,
      { isLoading: false, reset: vi.fn() },
    ]);

    const mockSetStatus = vi.fn();
    let capturedOnSubmit: any;

    vi.mocked(useFormik).mockImplementation((config) => {
      capturedOnSubmit = config.onSubmit;
      return {
        values: { name: "", email: "", password: "", confirmPassword: "" },
        setStatus: mockSetStatus,
      } as any;
    });

    renderHook(() => useSignUp());

    await act(async () => {
      await capturedOnSubmit({
        name: "name",
        email: "test@mail.com",
        password: "password",
      });
    });

    expect(mockSetStatus).toHaveBeenCalledWith({
      backendError: "Network error",
    });
  });
});
