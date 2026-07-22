import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useTestReport, type TestReportType } from "./useTestReport";

const mockNavigate = vi.hoisted(() => vi.fn());
const mockTestReport = vi.hoisted(() => ({
  state: { testReport: undefined as TestReportType | undefined },
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockTestReport,
}));

describe("useTestReport", () => {
  const report = {
    testType: "spell",
    totalTerms: 2,
    progress: 1,
    totalMistakes: 1,
    mistakesReport: { hello: "hell" },
  };

  it("should return correct testReport object", () => {
    mockTestReport.state = { testReport: report as TestReportType };

    const { result } = renderHook(() => useTestReport());

    expect(result.current.testReport).toMatchObject(report);
  });

  it("should navigate to /spell-check page when clicking back and testType is spell", () => {
    mockTestReport.state = { testReport: report as TestReportType };

    const { result } = renderHook(() => useTestReport());

    act(() => {
      result.current.headerProps.leftIconAction();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/spell-check");
  });

  it("should navigate to /grammar-check page when clicking back and testType is grammar", () => {
    mockTestReport.state = {
      testReport: { ...report, testType: "grammar" } as TestReportType,
    };

    const { result } = renderHook(() => useTestReport());

    act(() => {
      result.current.headerProps.leftIconAction();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/grammar-check");
  });
});
