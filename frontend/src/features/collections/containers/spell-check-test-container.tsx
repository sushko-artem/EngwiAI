import { useMemo } from "react";
import backArrow from "@assets/images/arrow-left.svg";
import option from "@assets/images/options.png";
import { Header } from "@widgets/header";
import { useSpellCheckTest } from "../hooks";
import { Loader } from "@shared/ui/loader";
import { SpellTestDescription, SpellTestMainContent } from "../ui";

export const SpellCheckTestContainer = () => {
  const { back, collection, isLoading, error } = useSpellCheckTest();
  const headerProps = useMemo(
    () => ({
      leftIconTitle: "вернуться к выбору модулей",
      rightIconTitle: "настройки",
      rightIconAction: () => {},
      leftIconAction: back,
      leftIcon: backArrow,
      rightIcon: option,
      title: "Тест орфографии",
    }),
    [back],
  );

  const renderContent = () => {
    if (isLoading) return <Loader />;
    if (!collection.length) return null;
    if (error) return <div>Ошибка загрузки карточек. Попробуйте позже.</div>;

    return (
      <>
        <SpellTestDescription />
        <SpellTestMainContent collection={collection} index={0} />
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
