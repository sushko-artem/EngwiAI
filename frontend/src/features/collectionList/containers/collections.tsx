import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { Header } from "@shared/ui/header";
import backArrow from "@assets/images/arrow-left.svg";

export const CollectionList = () => {
  const navigate = useNavigate();
  const back = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  return (
    <>
      <Header
        title="Мои модули"
        leftIcon={backArrow}
        leftIconTitle="вернуться на главную"
        leftIconAction={back}
      />
    </>
  );
};
