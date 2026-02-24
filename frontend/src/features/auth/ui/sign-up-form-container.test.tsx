/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from "vitest";
import { SignUpFormContainer } from "./sign-up-form-container";
import { createMockFormik } from "test/utils";
import { render, screen } from "@testing-library/react";

describe("SignUpFormContainer", () => {
  it("should render signUp form", () => {
    const mockFormik: any = createMockFormik({
      values: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    });

    render(<SignUpFormContainer formik={mockFormik} />);

    expect(screen.getByLabelText(/имя/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/почта/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Введите пароль")).toBeInTheDocument();
    expect(screen.getByLabelText("Подтвердите пароль")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Зарегистрироваться" }),
    ).toBeInTheDocument();
  });

  it("should shows validation errors when fields are touched", () => {
    const mockFormik: any = createMockFormik({
      touched: {
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
      },
      errors: {
        name: "name required",
        email: "email required",
        password: "password required",
        confirmPassword: "confirmPassword required",
      },
    });

    render(<SignUpFormContainer formik={mockFormik} />);

    expect(screen.getByText("name required")).toBeInTheDocument();
    expect(screen.getByText("email required")).toBeInTheDocument();
    expect(screen.getByText("password required")).toBeInTheDocument();
    expect(screen.getByText("confirmPassword required")).toBeInTheDocument();
  });

  it("should shows backend error from status", () => {
    const mockFormik: any = createMockFormik({
      status: { backendError: "Network error" },
    });

    render(<SignUpFormContainer formik={mockFormik} />);

    expect(screen.getByText(/Network error/i)).toBeInTheDocument();
  });

  it("should disabled button when form is invalid", () => {
    const mockFormik: any = createMockFormik({
      isValid: false,
    });

    render(<SignUpFormContainer formik={mockFormik} />);

    expect(
      screen.getByRole("button", { name: "Зарегистрироваться" }),
    ).toBeDisabled();
  });

  it("should disabled button when submitting", () => {
    const mockFormik: any = createMockFormik({
      isValid: true,
      isSubmitting: true,
    });

    render(<SignUpFormContainer formik={mockFormik} />);

    expect(
      screen.getByRole("button", { name: "Зарегистрироваться" }),
    ).toBeDisabled();
  });
});
