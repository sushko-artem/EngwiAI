import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type TestReportType = {
  testType: "spell" | "grammar";
  totalTerms: number;
  progress: number;
  totalMistakes: number;
  mistakesReport: Record<string, string>;
};

export const useTestReport = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state?.testReport) {
      navigate("/dashboard");
    }
  }, [location.state, navigate]);

  const handleBack = useCallback(() => {
    if (location.state?.testReport.testType === "spell") {
      navigate("/spell-check");
    } else {
      navigate("/dashboard"); // while haven't grammar feature
    }
  }, [navigate, location.state]);

  return {
    testReport: location.state?.testReport as TestReportType,
    handleBack,
  };
};
