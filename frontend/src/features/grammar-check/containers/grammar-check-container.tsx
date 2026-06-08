import { Header } from "@widgets/header";
import { useMemo } from "react";
import backArrow from "@assets/images/arrow-left.svg";
import { GrammarCheckDescription } from "../ui";
import { useGrammarCheck } from "../lib/hooks/useGrammarCheck";
import { Loader } from "shared/ui/loader";
import {
  ChooseModuleList,
  ChooseVisibleSide,
} from "@widgets/choose-collection";
import { NotASingleCollection } from "@entities/collection/ui";

export const GrammarCheckContainer = () => {
  const {
    isLoading,
    handleBack,
    startTest,
    collections,
    visibleSide,
    setVisibleSide,
    setChosenId,
    chosenId,
  } = useGrammarCheck();
  const headerProps = useMemo(
    () => ({
      title: "Грамматика",
      leftIcon: backArrow,
      leftIconTitle: "Вернуться на главную",
      leftIconAction: handleBack,
    }),
    [handleBack],
  );

  const renderContent = () => {
    if (isLoading) return <Loader />;
    if (!collections?.length) return <NotASingleCollection />;
    return (
      <>
        <GrammarCheckDescription />
        <ChooseModuleList
          collectionsList={collections}
          onToggle={setChosenId}
          chosenIds={chosenId}
        />
        <div className="mb-4 text-center">
          <ChooseVisibleSide
            sideValue={visibleSide}
            onChange={setVisibleSide}
          />
        </div>
        <div className="text-center">
          <button
            data-testid="start-test"
            onClick={startTest}
            className="border-zinc-500 rounded-[5px] cursor-pointer border-2 p-2 mt-4 font-comic font-bold text-cyan-900 bg-[rgb(168,145,124)] active:bg-[rgb(184,157,133)] transition-all"
          >
            Начать тест
          </button>
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
