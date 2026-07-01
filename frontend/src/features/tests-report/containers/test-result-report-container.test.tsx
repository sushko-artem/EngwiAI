import { describe, expect, it, vi } from "vitest";
import { useTestReport } from "../hooks";
import { fireEvent, render, screen } from "@testing-library/react";
import { TestResultReportContainer } from "./test-results-report-container";
import { MemoryRouter } from "react-router-dom";

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

const headerProps = {
  title: "Title",
  leftIcon: "backArrow",
  leftIconTitle: "IconTitle",
  leftIconAction: mockHandleBack,
};

describe("TestResultReportContainer", () => {
  it("should render correct props", () => {
    vi.mocked(useTestReport).mockReturnValue({
      headerProps,
      testReport: mockTestReport,
    });
    render(<TestResultReportContainer />);
    expect(screen.getByText("hell")).toBeInTheDocument();
    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("should call handleBack when clicking on back arrow button", () => {
    vi.mocked(useTestReport).mockReturnValue({
      headerProps,
      testReport: mockTestReport,
    });
    render(<TestResultReportContainer />);
    fireEvent.click(screen.getByTestId("leftIconAction"));
    expect(mockHandleBack).toHaveBeenCalled();
  });

  it("should navigate to /dashboard when no report in location.state", () => {
    vi.mocked(useTestReport).mockReturnValue({
      headerProps,
      testReport: undefined,
    });
    render(
      <MemoryRouter>
        <TestResultReportContainer />
      </MemoryRouter>,
    );
    expect(screen.queryByText("Анализ ошибок")).not.toBeInTheDocument();
  });
});
