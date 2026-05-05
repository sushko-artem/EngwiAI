import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type TestReportType = {
  testType: "spell" | "grammar";
  totalTerms: number;
  progress: number;
  totalMistakes: number;
  mistakesReport: Record<string, string>;
};

export const useTestReport = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    if (location.state?.testReport.testType === "spell") {
      navigate("/spell-check");
    } else {
      navigate("/dashboard"); // while haven't grammar feature
    }
  }, [navigate, location.state]);

  return {
    testReport: location.state?.testReport as TestReportType | undefined,
    handleBack,
  };
};
