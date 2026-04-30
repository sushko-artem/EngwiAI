import { Header } from "@widgets/header";
import backArrow from "@assets/images/arrow-left.svg";
import { useMemo } from "react";
import { useTestReport } from "../hooks";
import { MistakesReport, ResultSummary } from "../ui";

export const TestResultReportContainer = () => {
  const { handleBack, testReport } = useTestReport();
  const { totalTerms, progress, totalMistakes, mistakesReport } = testReport;
  const headerProps = useMemo(
    () => ({
      title: "Результаты теста",
      leftIcon: backArrow,
      leftIconTitle: "Назад",
      leftIconAction: handleBack,
    }),
    [handleBack],
  );
  return (
    <>
      <Header {...headerProps} />
      <ResultSummary
        totalTerms={totalTerms}
        progress={progress}
        totalMistakes={totalMistakes}
      />
      <MistakesReport report={mistakesReport} />
    </>
  );
};
