import { Header } from "@widgets/header";
import {
  ChooseCount,
  ChooseDifficultyLevel,
  GrammarCheckDescription,
} from "../ui";
import { useGrammarCheck } from "../lib";
import { Loader } from "@shared/ui/loader";
import {
  ChooseModuleList,
  ChooseVisibleSide,
} from "@widgets/choose-collection";
import { NotASingleCollection } from "@entities/collection/ui";
import { QueryCollectionsError } from "@widgets/query-collections-error";

export const GrammarCheckContainer = () => {
  const {
    isLoading,
    error,
    headerProps,
    startTest,
    collections,
    cardSide,
    setCardSide,
    setChosenId,
    chosenId,
    difficulty,
    setDifficulty,
    count,
    setCount,
  } = useGrammarCheck();

  const renderContent = () => {
    if (isLoading) return <Loader />;
    if (error) return <QueryCollectionsError error={error} />;
    if (!collections?.length) return <NotASingleCollection />;
    return (
      <>
        <GrammarCheckDescription />
        <ChooseModuleList
          collectionsList={collections}
          onToggle={setChosenId}
          chosenIds={chosenId}
        />
        <ChooseVisibleSide sideValue={cardSide} onChange={setCardSide} />
        <ChooseDifficultyLevel level={difficulty} onChange={setDifficulty} />
        <ChooseCount count={count} onChange={setCount} />
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
