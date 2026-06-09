import { useMemo } from "react";
import backArrow from "@assets/images/arrow-left.svg";
import { Header } from "@widgets/header";
import { Loader } from "@shared/ui/loader";
import { useSpellCheck } from "../lib";
import { NotASingleCollection } from "@entities/collection/ui";
import { SpellCheckDescription } from "../ui";
import {
  ChooseModuleList,
  ChooseVisibleSide,
} from "@widgets/choose-collection";

export const SpellCheckContainer = () => {
  const {
    collections,
    isLoading,
    chosenIds,
    toggleChoosenModule,
    startTest,
    visibleSide,
    setVisibleSide,
    handleBack,
  } = useSpellCheck();

  const headerProps = useMemo(
    () => ({
      title: "Орфография",
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
        <SpellCheckDescription />
        <ChooseModuleList
          collectionsList={collections}
          onToggle={toggleChoosenModule}
          chosenIds={chosenIds}
        />
        <ChooseVisibleSide sideValue={visibleSide} onChange={setVisibleSide} />
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
