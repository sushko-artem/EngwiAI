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
import {
  NotASingleCollection,
  QueryCollectionsError,
} from "@entities/collection/ui";
import { StartTestButtonContainer } from "../ui/button-container";

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
        <StartTestButtonContainer handleClick={startTest} />
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
