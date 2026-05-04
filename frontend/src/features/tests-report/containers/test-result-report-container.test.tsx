import { describe, expect, it, vi } from "vitest";
import { useTestReport } from "../hooks";
import { fireEvent, render, screen } from "@testing-library/react";
import { TestResultReportContainer } from "./test-results-report-container";

const mockHandleBack = vi.hoisted(() => vi.fn());

const mockTestReport = {
  testType: "spell" as "spell" | "grammar",
  totalTerms: 2,
  progress: 50,
  totalMistakes: 1,
  mistakesReport: { hello: "hell" },
};

vi.mock("../hooks", () => ({
  useTestReport: vi.fn(),
}));

describe("TestResultReportContainer", () => {
  it("should render correct props", () => {
    vi.mocked(useTestReport).mockReturnValue({
      handleBack: mockHandleBack,
      testReport: mockTestReport,
    });
    render(<TestResultReportContainer />);
    expect(screen.getByText("hell")).toBeInTheDocument();
    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("should call handleBack when clicking on back arrow button", () => {
    vi.mocked(useTestReport).mockReturnValue({
      handleBack: mockHandleBack,
      testReport: mockTestReport,
    });
    render(<TestResultReportContainer />);
    fireEvent.click(screen.getByTestId("leftIconAction"));
    expect(mockHandleBack).toHaveBeenCalled();
  });
});
