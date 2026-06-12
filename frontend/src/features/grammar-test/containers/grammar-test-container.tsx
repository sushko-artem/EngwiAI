import { useCallback, useMemo } from "react";
import backArrow from "@assets/images/arrow-left.svg";
import { useNavigate } from "react-router-dom";
import { Header } from "@widgets/header";
import { useGrammarTest } from "../lib/hooks/useGrammarTest";
import { Loader } from "shared/ui/loader";

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
    if (error) return <div>{JSON.stringify(error)}</div>;
    return <>{JSON.stringify(sentences)}</>;
  };

  return (
    <>
      <Header {...headerProps} />
      {renderContent()}
    </>
  );
};
