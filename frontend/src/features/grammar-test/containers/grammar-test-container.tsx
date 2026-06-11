import { useCallback, useMemo } from "react";
import backArrow from "@assets/images/arrow-left.svg";
import { useNavigate } from "react-router-dom";
import { Header } from "@widgets/header";

export const GrammarTestContainer = () => {
  const navigate = useNavigate();

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
  return (
    <>
      <Header {...headerProps} />
    </>
  );
};
