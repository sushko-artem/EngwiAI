import { useCallback, useMemo } from "react";
import backArrow from "@assets/images/arrow-left.svg";
import option from "@assets/images/options.png";
import { Header } from "@widgets/header";
import { useSpellTest } from "@features/collections/hooks";
import { Loader } from "@shared/ui/loader";
import {
  SpellTestDescription,
  SpellTestMainContent,
  SpellTestOptionsMenu,
  SpellTestResultModal,
} from "../ui";
import { useNavigate } from "react-router-dom";

export const SpellCheckTestContainer = () => {
  const {
    collection,
    isLoading,
    error,
    index,
    handleAnswer,
    visibleSide,
    isSummaryOpen,
    rightAnswersCount,
    userMistakes,
    resetTest,
    inProgress,
    options,
    isMenuOptionsOpen,
    closeMenuOptions,
    play,
    isGroupMuted,
    toggleGroup,
  } = useSpellTest();
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate("/spell-check");
  }, [navigate]);

  const headerProps = useMemo(
    () => ({
      leftIconTitle: "вернуться к выбору модулей",
      rightIconTitle: "настройки",
      rightIconAction: options,
      leftIconAction: handleBack,
      leftIcon: backArrow,
      rightIcon: option,
      title: "Тест орфографии",
    }),
    [handleBack, options],
  );

  const renderContent = () => {
    if (isLoading) return <Loader />;
    if (!collection.length) return null;
    if (error) return <div>Ошибка загрузки карточек. Попробуйте позже.</div>;

    return (
      <>
        <SpellTestDescription />
        <SpellTestMainContent
          visibleSide={visibleSide}
          collection={collection}
          index={index}
          inProgress={inProgress}
          onAnswer={handleAnswer}
          playSound={play}
        />
        {isSummaryOpen && (
          <SpellTestResultModal
            totalCards={collection.length}
            rightAnswers={rightAnswersCount}
            userMistakes={userMistakes}
            reset={resetTest}
          />
        )}
        {isMenuOptionsOpen && (
          <SpellTestOptionsMenu
            isMenuOpen={isMenuOptionsOpen}
            onClose={closeMenuOptions}
            reset={resetTest}
            isGroupMuted={isGroupMuted}
            toggleGroup={toggleGroup}
          />
        )}
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
