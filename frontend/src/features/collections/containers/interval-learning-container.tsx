import { useMemo } from "react";
import backArrow from "@assets/images/arrow-left.svg";
import { Header } from "@widgets/header";
import { useIntervalLearning } from "@features/collections/hooks";
import {
  IntervalDescription,
  NotASingleCollection,
} from "@features/collections/ui";
import { Loader } from "@shared/ui/loader";
import { IntervalLearningAction } from "../ui/interval-learning/interval-learning-action";
import { VIRTUAL_COLLECTIONS } from "@features/collections/helpers/virtual-collection-ident-helper";

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
    return (
      <>
        <IntervalDescription />
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 m-auto md:max-w-[50%] max-w-[80%]">
          <IntervalLearningAction
            type={VIRTUAL_COLLECTIONS.ACTIVE}
            collectionLength={activeLength}
          />
          <IntervalLearningAction
            type={VIRTUAL_COLLECTIONS.INACTIVE}
            collectionLength={inactiveLength}
          />
        </div>
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
