import { Header } from "@widgets/header";
import { Loader } from "@shared/ui/loader";
import {
  GenerationError,
  GrammarTestContent,
  GrammarTestDescription,
} from "../ui";
import { useGrammarTest } from "../lib";
import { TestOptionsMenu, TestResultModal } from "@widgets/user-tests";

export const GrammarTestContainer = () => {
  const {
    headerProps,
    sentences,
    isLoading,
    error,
    index,
    handleAnswer,
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
    if (!sentences?.translations?.length) {
      return <GenerationError error="Ошибка генерации ИИ" />;
    }
    return (
      <>
        <div>{sentences.translations}</div>
        <GrammarTestDescription />
        <GrammarTestContent
          sentences={sentences}
          onAnswer={handleAnswer}
          index={index}
        />
        {isSummaryOpen && (
          <TestResultModal
            testType="grammar"
            navigateBackTo="/grammar-check"
            totalItems={sentences?.translations.length}
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
