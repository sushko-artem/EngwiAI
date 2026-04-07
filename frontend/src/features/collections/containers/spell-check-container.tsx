import { useMemo } from "react";
import backArrow from "@assets/images/arrow-left.svg";
import { Header } from "@widgets/header";
import { useSpellCheck } from "../hooks";
import { SpellCheckDescription } from "../ui";

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
      <SpellCheckDescription />
    </>
  );
};
