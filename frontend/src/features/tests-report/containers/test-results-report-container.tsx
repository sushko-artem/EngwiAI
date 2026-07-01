import { Header } from "@widgets/header";
import { useTestReport } from "../hooks";
import { MistakesReport, ResultSummary } from "../ui";
import { Navigate } from "react-router-dom";

export const TestResultReportContainer = () => {
  const { headerProps, testReport } = useTestReport();

  if (!testReport) return <Navigate to="/dashboard" replace />;
  const { totalTerms, progress, totalMistakes, mistakesReport } = testReport;

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
