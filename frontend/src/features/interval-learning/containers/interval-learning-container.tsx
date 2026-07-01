import { Header } from "@widgets/header";
import { Loader } from "@shared/ui/loader";
import { cn } from "@shared/lib/utils";
import { useIntervalLearning } from "../lib";
import { NotASingleCollection } from "@entities/collection/ui";
import { IntervalActionsBox, IntervalDescription } from "../ui/";

export const IntervalLearningContainer = () => {
  const { activeLength, inactiveLength, isLoading, isRefetching, headerProps } =
    useIntervalLearning();

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
