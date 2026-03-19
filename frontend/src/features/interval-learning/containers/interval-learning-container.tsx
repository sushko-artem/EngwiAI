import { useMemo } from "react";
import backArrow from "@assets/images/arrow-left.svg";
import { Header } from "@widgets/header";

export const IntervalLearningContainer = () => {
  const headerProps = useMemo(
    () => ({
      title: "Интервальное повторение",
      leftIcon: backArrow,
      leftIconTitle: "Вернуться на главную",
      leftIconAction: () => {},
    }),
    [],
  );

  return (
    <>
      <Header {...headerProps} />
    </>
  );
};
