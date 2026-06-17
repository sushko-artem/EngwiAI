import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import backArrow from "@assets/images/arrow-left.svg";
import { Header } from "@widgets/header";
import { Loader } from "@shared/ui/loader";
import { GenerationError, GrammarTestDescription } from "../ui";
import { useGrammarTest } from "../lib";

export const GrammarTestContainer = () => {
  const navigate = useNavigate();
  const { sentences, isLoading, error } = useGrammarTest();

  const handleBack = useCallback(() => {
    navigate("/grammar-check");
  }, [navigate]);

  const headerProps = useMemo(
    () => ({
      title: "Грамматический тест",
      leftIcon: backArrow,
      leftIconTitle: "Вернуться на главную",
      leftIconAction: handleBack,
    }),
    [handleBack],
  );

  const renderContent = () => {
    if ((isLoading || !sentences) && !error) return <Loader />;
    if (error) return <GenerationError error={error} />;
    return (
      <>
        <GrammarTestDescription />
        <div>{sentences?.translations[0]}</div>
        <div>
          {sentences?.splitedSentences[0].map((word, index) => (
            <div key={index}>{word}</div>
          ))}
        </div>
        <div>
          {sentences?.shuffledSentences[0].map((word, index) => (
            <div key={index}>{word}</div>
          ))}
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
