import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TestResultModal } from "./test-result-modal";
import type { TestType } from "./types";

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("TestModal", () => {
  const defaultProps = {
    testType: "spell" as TestType,
    navigateBackTo: "/spell-check",
    totalItems: 2,
    rightAnswers: 1,
    userMistakes: { hello: "hell" },
    reset: vi.fn(),
  };
  it("should render correct summary", () => {
    render(<TestResultModal {...defaultProps} />);
    expect(screen.getByRole("heading")).toHaveTextContent("Можно лучше!");
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getAllByTestId("modal-action")).toHaveLength(3);
  });

  it("should not render mistakesReport button when no mistakes", () => {
    const props = { ...defaultProps, rightAnswers: 2, userMistakes: {} };
    render(<TestResultModal {...props} />);
    expect(screen.getAllByTestId("modal-action")).toHaveLength(2);
  });

  it("sould call reset when clicking reset button", () => {
    render(<TestResultModal {...defaultProps} />);
    fireEvent.click(screen.getAllByTestId("modal-action")[1]);
    expect(defaultProps.reset).toHaveBeenCalled();
  });

  it("should navigate to /spell-check when testType is 'spell' and clicking on cancel test button", () => {
    render(<TestResultModal {...defaultProps} />);
    fireEvent.click(screen.getAllByTestId("modal-action")[2]);
    expect(mockNavigate).toHaveBeenCalledWith("/spell-check");
  });

  it("should navigate to /grammar-check when testType is 'grammar' and clicking on cancel test button", () => {
    const props = {
      ...defaultProps,
      testType: "grammar" as TestType,
      navigateBackTo: "/grammar-check",
    };
    render(<TestResultModal {...props} />);
    fireEvent.click(screen.getAllByTestId("modal-action")[2]);
    expect(mockNavigate).toHaveBeenCalledWith("/grammar-check");
  });

  it("should navigate to /test-report page when clicking on testReport button", () => {
    render(<TestResultModal {...defaultProps} />);
    fireEvent.click(screen.getAllByTestId("modal-action")[0]);
    expect(mockNavigate).toHaveBeenCalledWith("/test-report", {
      state: {
        testReport: {
          testType: "spell",
          totalTerms: defaultProps.totalItems,
          progress: 50,
          totalMistakes: defaultProps.totalItems - defaultProps.rightAnswers,
          mistakesReport: defaultProps.userMistakes,
        },
      },
    });
  });
});
