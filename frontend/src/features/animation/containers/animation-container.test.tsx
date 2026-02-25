import { StartAnimationContainer } from "./animation-container";
import { render, screen } from "@testing-library/react";
import { describe, vi, it, beforeEach, expect } from "vitest";
import { useAnimation } from "../hooks";

vi.mock("@features/animation/hooks", () => ({
  useAnimation: vi.fn(),
}));

vi.mock("@assets/images/logo_project.webp", () => ({
  default: "test-logo-path",
}));

describe("StartAnimationContainer", () => {
  beforeEach(() => {
    vi.mocked(useAnimation).mockReturnValue({
      isAnimated: false,
      completeAnimation: vi.fn(),
    });
  });

  it("should show logo on first render", () => {
    render(<StartAnimationContainer />);
    const container = screen.getByTestId("logoContainer");
    expect(container).toHaveClass(
      "flex justify-center items-center min-h-[100vh]"
    );
    expect(screen.getByAltText("logo")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "test-logo-path");
  });

  it("should not render when animation completed", () => {
    vi.mocked(useAnimation).mockReturnValue({
      isAnimated: true,
      completeAnimation: vi.fn(),
    });
    render(<StartAnimationContainer />);
    expect(screen.queryByAltText("logo")).not.toBeInTheDocument();
  });
});
