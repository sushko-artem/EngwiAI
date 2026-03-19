import { useMemo } from "react";
import backArrow from "@assets/images/arrow-left.svg";
import { Header } from "@widgets/header";
import { useIntervalLearning } from "../hooks";
import { IntervalDescription } from "../ui";

export const IntervalLearningContainer = () => {
  const { back, activeLength, inactiveLength } = useIntervalLearning();
  const headerProps = useMemo(
    () => ({
      title: "Интервальное повторение",
      leftIcon: backArrow,
      leftIconTitle: "Вернуться на главную",
      leftIconAction: back,
    }),
    [back],
  );

  console.log(activeLength, inactiveLength);

  return (
    <>
      <Header {...headerProps} />
      <IntervalDescription />
    </>
  );
};
