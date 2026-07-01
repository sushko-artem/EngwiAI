import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import backArrow from "@assets/images/arrow-left.svg";

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

  const headerProps = useMemo(
    () => ({
      title: "Результаты теста",
      leftIcon: backArrow,
      leftIconTitle: "Назад",
      leftIconAction: () => {
        if (location.state?.testReport.testType === "spell") {
          navigate("/spell-check");
        } else {
          navigate("/grammar-check");
        }
      },
    }),
    [navigate, location.state],
  );

  return {
    testReport: location.state?.testReport as TestReportType | undefined,
    headerProps,
  };
};
