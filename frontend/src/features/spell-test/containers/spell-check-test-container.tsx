import { Header } from "@widgets/header";
import { useSpellTest } from "../lib";
import { Loader } from "@shared/ui/loader";
import { SpellTestDescription, SpellTestMainContent } from "../ui";
import { TestOptionsMenu, TestResultModal } from "@widgets/user-tests";

export const SpellCheckTestContainer = () => {
  const {
    headerProps,
    collection,
    isLoading,
    error,
    index,
    handleUserAnswer,
    borderType,
    visibleSide,
    isSummaryOpen,
    rightAnswersCount,
    userMistakes,
    resetTest,
    inProgress,
    isMenuOptionsOpen,
    closeMenu,
    isGroupMuted,
    toggleGroup,
  } = useSpellTest();

  const renderContent = () => {
    if (isLoading || !collection) return <Loader />;
    if (error) return <div>Ошибка загрузки карточек. Попробуйте позже.</div>;

    return (
      <>
        <SpellTestDescription />
        <SpellTestMainContent
          visibleSide={visibleSide}
          collection={collection}
          index={index}
          inProgress={inProgress}
          onAnswer={handleUserAnswer}
          borderType={borderType}
        />
        {isSummaryOpen && (
          <TestResultModal
            testType="spell"
            navigateBackTo="/spell-check"
            totalItems={collection.length}
            rightAnswers={rightAnswersCount}
            userMistakes={userMistakes}
            reset={resetTest}
          />
        )}
        {isMenuOptionsOpen && (
          <TestOptionsMenu
            soundGroup="TestGroup"
            isMenuOpen={isMenuOptionsOpen}
            onClose={closeMenu}
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
