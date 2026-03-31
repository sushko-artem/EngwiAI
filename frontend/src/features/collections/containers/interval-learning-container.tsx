import { useMemo } from "react";
import backArrow from "@assets/images/arrow-left.svg";
import { Header } from "@widgets/header";
import { useIntervalLearning } from "@features/collections/hooks";
import {
  IntervalActionsBox,
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
        <div
          data-testid="interval-opacity"
          className={cn(isRefetching && "opacity-10 transition-opacity")}
        >
          <IntervalActionsBox
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
