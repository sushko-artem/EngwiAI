import { describe, expect, it, vi } from "vitest";
import { useSignUp } from "./useSignUp";
import { act } from "react";
import { setupAuthHook } from "test/utils";

vi.mock("formik");
vi.mock("react-router-dom");
vi.mock("@features/auth");

describe("useSignUp", () => {
  it("should init with empty form", () => {
    const { result } = setupAuthHook(useSignUp, {
      formik: {
        values: { name: "", email: "", password: "", confirmPassword: "" },
      },
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.formik.values.name).toBe("");
    expect(result.current.formik.values.email).toBe("");
    expect(result.current.formik.values.password).toBe("");
    expect(result.current.formik.values.confirmPassword).toBe("");
  });

  it("should redirect to sign-in when register successful", async () => {
    const {
      mockAction: mockRegister,
      mockNavigate,
      capturedOnSubmit,
    } = setupAuthHook(useSignUp, {
      formik: {
        values: { name: "", email: "", password: "", confirmPassword: "" },
      },
    });
    mockRegister.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({}),
    });

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
    const mockSetErrors = vi.fn();
    const { mockAction: mockRegister, capturedOnSubmit } = setupAuthHook(
      useSignUp,
      {
        formik: {
          values: { name: "", email: "", password: "", confirmPassword: "" },
          setErrors: mockSetErrors,
        },
      }
    );
    mockRegister.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue({
        status: 409,
        data: {
          error: "email",
          message: "user with this email already exist",
        },
      }),
    });

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
    const mockSetStatus = vi.fn();
    const { mockAction: mockRegister, capturedOnSubmit } = setupAuthHook(
      useSignUp,
      {
        formik: {
          values: { name: "", email: "", password: "", confirmPassword: "" },
          setStatus: mockSetStatus,
        },
      }
    );
    mockRegister.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue(new Error("Network error")),
    });

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
