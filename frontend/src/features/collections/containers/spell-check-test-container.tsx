import { useCallback, useMemo } from "react";
import backArrow from "@assets/images/arrow-left.svg";
import option from "@assets/images/options.png";
import { Header } from "@widgets/header";
import { useSpellTest } from "../hooks";
import { Loader } from "@shared/ui/loader";
import { SpellTestDescription, SpellTestMainContent } from "../ui";
import { useNavigate } from "react-router-dom";

export const SpellCheckTestContainer = () => {
  const { collection, isLoading, error, index, handleAnswer, visibleSide } =
    useSpellTest();
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate("/spell-check");
  }, [navigate]);

  const headerProps = useMemo(
    () => ({
      leftIconTitle: "вернуться к выбору модулей",
      rightIconTitle: "настройки",
      rightIconAction: () => {},
      leftIconAction: handleBack,
      leftIcon: backArrow,
      rightIcon: option,
      title: "Тест орфографии",
    }),
    [handleBack],
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
          onAnswer={handleAnswer}
        />
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
