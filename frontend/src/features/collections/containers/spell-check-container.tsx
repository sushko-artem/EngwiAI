import { useMemo } from "react";
import backArrow from "@assets/images/arrow-left.svg";
import { Header } from "@widgets/header";
import { useSpellCheck } from "../hooks";

export const SpellCheckContainer = () => {
  const { back } = useSpellCheck();
  const headerProps = useMemo(
    () => ({
      title: "Орфография",
      leftIcon: backArrow,
      leftIconTitle: "Вернуться на главную",
      leftIconAction: back,
    }),
    [back],
  );

  return (
    <>
      <Header {...headerProps} />
    </>
  );
};
