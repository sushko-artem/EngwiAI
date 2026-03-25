import { useMemo } from "react";
import backArrow from "@assets/images/arrow-left.svg";
import { Header } from "@widgets/header";
import { useIntervalLearning } from "@features/collections/hooks";
import {
  IntervalActionsBlock,
  IntervalDescription,
  NotASingleCollection,
} from "@features/collections/ui";
import { Loader } from "@shared/ui/loader";

export const IntervalLearningContainer = () => {
  const { back, activeLength, inactiveLength, isLoading } =
    useIntervalLearning();
  const headerProps = useMemo(
    () => ({
      title: "Контрольное тестирование",
      leftIcon: backArrow,
      leftIconTitle: "Вернуться на главную",
      leftIconAction: back,
    }),
    [back],
  );

  const renderContent = () => {
    if (isLoading) return <Loader />;
    if (!activeLength && !inactiveLength) return <NotASingleCollection />;
    return (
      <>
        <IntervalActionsBlock
          moduleLength={{ active: activeLength, inactive: inactiveLength }}
        />
        <IntervalDescription />
      </>
    );
  };

  return (
    <>
      <Header {...headerProps} />
      {renderContent()}
    </>
  );
};
