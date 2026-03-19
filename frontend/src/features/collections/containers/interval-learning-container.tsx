import { useMemo } from "react";
import backArrow from "@assets/images/arrow-left.svg";
import { Header } from "@widgets/header";
import { useIntervalLearning } from "@features/collections/hooks";
import {
  IntervalDescription,
  NotASingleCollection,
} from "@features/collections/ui";
import { Loader } from "@shared/ui/loader";

export const IntervalLearningContainer = () => {
  const { back, activeLength, inactiveLength, isLoading } =
    useIntervalLearning();
  const headerProps = useMemo(
    () => ({
      title: "Интервальное повторение",
      leftIcon: backArrow,
      leftIconTitle: "Вернуться на главную",
      leftIconAction: back,
    }),
    [back],
  );

  const renderContent = () => {
    if (isLoading) return <Loader />;
    if (!activeLength && !inactiveLength) return <NotASingleCollection />;
    return <IntervalDescription />;
  };

  return (
    <>
      <Header {...headerProps} />
      {renderContent()}
    </>
  );
};
