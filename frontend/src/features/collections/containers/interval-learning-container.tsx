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
import { cn } from "@shared/lib/utils";

export const IntervalLearningContainer = () => {
  const { back, activeLength, inactiveLength, isLoading, isRefetching } =
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
        <div className={cn(isRefetching && "opacity-10 transition-opacity")}>
          <IntervalActionsBlock
            moduleLength={{ active: activeLength, inactive: inactiveLength }}
          />
        </div>
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
