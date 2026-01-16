/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from "vitest";
import { SignInFormContainer } from "./sign-in-form-container";
import { createMockFormik } from "test/utils";
import { render, screen } from "@testing-library/react";

describe("SignInFormContainer", () => {
  it("should render signIn form", () => {
    const mockFormik: any = createMockFormik();

    render(<SignInFormContainer formik={mockFormik} />);

    expect(screen.getByLabelText(/почта/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/пароль/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Войти" })).toBeInTheDocument();
  });

  it("should shows validation errors when fields are touched", () => {
    const mockFormik: any = createMockFormik({
      touched: { email: true, password: true },
      errors: { email: "email required", password: "password required" },
    });

    render(<SignInFormContainer formik={mockFormik} />);

    expect(screen.getByText("email required")).toBeInTheDocument();
    expect(screen.getByText("password required")).toBeInTheDocument();
  });

  it("should shows backend error from status", () => {
    const mockFormik: any = createMockFormik({
      status: { backendError: "Network error" },
    });

    render(<SignInFormContainer formik={mockFormik} />);

    expect(screen.getByText(/Network error/i)).toBeInTheDocument();
  });

  it("should disabled button when form is invalid", () => {
    const mockFormik: any = createMockFormik({
      isValid: false,
    });

    render(<SignInFormContainer formik={mockFormik} />);

    expect(screen.getByRole("button", { name: "Войти" })).toBeDisabled();
  });

  it("should disabled button when submitting", () => {
    const mockFormik: any = createMockFormik({
      isValid: true,
      isSubmitting: true,
    });

    render(<SignInFormContainer formik={mockFormik} />);

    expect(screen.getByRole("button", { name: "Войти" })).toBeDisabled();
  });
});
