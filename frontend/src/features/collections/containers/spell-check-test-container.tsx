import { useMemo } from "react";
import backArrow from "@assets/images/arrow-left.svg";
import option from "@assets/images/options.png";
import { Header } from "@widgets/header";

export const SpellCheckTestContainer = () => {
  const headerProps = useMemo(
    () => ({
      leftIconTitle: "вернуться к выбору модулей",
      rightIconTitle: "настройки",
      rightIconAction: () => {},
      leftIconAction: () => {},
      leftIcon: backArrow,
      rightIcon: option,
      title: "Тест орфографии",
    }),
    [],
  );
  return (
    <>
      <Header {...headerProps} />
    </>
  );
};
