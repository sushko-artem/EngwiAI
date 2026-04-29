import { Header } from "@widgets/header";
import backArrow from "@assets/images/arrow-left.svg";
import { useMemo } from "react";
import { useTestReport } from "../hooks";

export const TestResultReportContainer = () => {
  const { handleBack, testReport } = useTestReport();
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
      <div>{JSON.stringify(testReport)}</div>
    </>
  );
};
