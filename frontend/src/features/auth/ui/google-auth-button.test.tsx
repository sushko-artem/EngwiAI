import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GoogleAuth } from "./google-auth-button";
import { googleAuthRedirect } from "../utils";

const mockWarning = vi.hoisted(() => vi.fn());

vi.mock("../utils", () => ({
  googleAuthRedirect: vi.fn(),
}));

vi.mock("@widgets/modal", () => ({
  useModal: () => ({
    warning: mockWarning,
  }),
}));

describe("GoogleAuthButton", () => {
  it("should render correctly", () => {
    render(<GoogleAuth provider={true} description="Google Auth" />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("alt", "google");
  });

  it("should redirect to GoogleAuth when clicked", () => {
    render(<GoogleAuth provider={true} description="Google Auth" />);

    fireEvent.click(screen.getByRole("button"));

    expect(googleAuthRedirect).toHaveBeenCalled();
  });
});
