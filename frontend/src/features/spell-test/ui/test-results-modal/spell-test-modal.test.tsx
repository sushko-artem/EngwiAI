import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SpellTestResultModal } from "./spell-test-modal";

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("SpellTestModal", () => {
  const defaultProps = {
    totalCards: 2,
    rightAnswers: 1,
    userMistakes: { hello: "hell" },
    reset: vi.fn(),
  };
  it("should render correct summary", () => {
    render(<SpellTestResultModal {...defaultProps} />);
    expect(screen.getByRole("heading")).toHaveTextContent("Можно лучше!");
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getAllByTestId("modal-action")).toHaveLength(3);
  });

  it("should not render mistakesReport button when no mistakes", () => {
    const props = { ...defaultProps, rightAnswers: 2, userMistakes: {} };
    render(<SpellTestResultModal {...props} />);
    expect(screen.getAllByTestId("modal-action")).toHaveLength(2);
  });

  it("sould call reset when clicking reset button", () => {
    render(<SpellTestResultModal {...defaultProps} />);
    fireEvent.click(screen.getAllByTestId("modal-action")[1]);
    expect(defaultProps.reset).toHaveBeenCalled();
  });

  it("should navigate to /spell-check when clicking on cancel test button", () => {
    render(<SpellTestResultModal {...defaultProps} />);
    fireEvent.click(screen.getAllByTestId("modal-action")[2]);
    expect(mockNavigate).toHaveBeenCalledWith("/spell-check");
  });

  it("should navigate to /test-report page when clicking on testReport button", () => {
    render(<SpellTestResultModal {...defaultProps} />);
    fireEvent.click(screen.getAllByTestId("modal-action")[0]);
    expect(mockNavigate).toHaveBeenCalledWith("/test-report", {
      state: {
        testReport: {
          testType: "spell",
          totalTerms: defaultProps.totalCards,
          progress: 50,
          totalMistakes: defaultProps.totalCards - defaultProps.rightAnswers,
          mistakesReport: defaultProps.userMistakes,
        },
      },
    });
  });
});
