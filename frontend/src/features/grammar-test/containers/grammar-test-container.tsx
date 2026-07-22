import { Header } from "@widgets/header";
import { Loader } from "@shared/ui/loader";
import {
  GenerationError,
  GrammarTestDescription,
  GrammarTestActionsLayout,
  GrammarTestTask,
  GrammarTestAnswerContainer,
} from "../ui";
import { useGrammarTest } from "../lib";
import { TestOptionsMenu, TestResultModal } from "@widgets/user-tests";

export const GrammarTestContainer = () => {
  const {
    headerProps,
    translation,
    shuffledWords,
    isLoading,
    error,
    index,
    borderType,
    handleUserAnswer,
    handleDragEnd,
    testLength,
    isSummaryOpen,
    rightAnswersCount,
    userMistakes,
    resetTest,
    isMenuOptionsOpen,
    closeMenu,
    isGroupMuted,
    toggleGroup,
  } = useGrammarTest();

  const renderContent = () => {
    if (isLoading) return <Loader />;
    if (error) return <GenerationError error={error} />;
    if (!testLength) {
      return <GenerationError error="Ошибка генерации ИИ" />;
    }
    return (
      <>
        <GrammarTestDescription />
        <GrammarTestActionsLayout>
          <GrammarTestTask
            index={index}
            testLength={testLength}
            translation={translation}
          />
          <GrammarTestAnswerContainer
            words={shuffledWords}
            handleAnswer={handleUserAnswer}
            handleDragEnd={handleDragEnd}
            borderType={borderType}
          />
        </GrammarTestActionsLayout>
        {isSummaryOpen && (
          <TestResultModal
            testType="grammar"
            navigateBackTo="/grammar-check"
            totalItems={testLength}
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
