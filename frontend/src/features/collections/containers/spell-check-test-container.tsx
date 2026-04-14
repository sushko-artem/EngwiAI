import { useMemo } from "react";
import backArrow from "@assets/images/arrow-left.svg";
import option from "@assets/images/options.png";
import { Header } from "@widgets/header";
import { useSpellCheckTest } from "../hooks";
import { Loader } from "@shared/ui/loader";

export const SpellCheckTestContainer = () => {
  const { back, collection, isLoading } = useSpellCheckTest();
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
  return (
    <>
      <Header {...headerProps} />
      {!collection.length && isLoading && <Loader />}
      <div>{JSON.stringify(collection)}</div>
    </>
  );
};
