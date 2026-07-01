import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import backArrow from "@assets/images/arrow-left.svg";

type TestType = "spell" | "grammar";

const TEST_ROUTES: Record<TestType, string> = {
  spell: "/spell-check",
  grammar: "/grammar-check",
};

export type TestReportType = {
  testType: TestType;
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
        const testType = location.state?.testReport?.testType;

        if (testType && testType in TEST_ROUTES) {
          navigate(TEST_ROUTES[testType as TestType]);
        } else {
          navigate("/dashboard");
        }
      },
    }),
    [navigate, location.state?.testReport.testType],
  );

  return {
    testReport: location.state?.testReport as TestReportType | undefined,
    headerProps,
  };
};
