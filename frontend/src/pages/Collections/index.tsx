import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CollectionList } from "@features/collections";
import { Header } from "widgets/header";
import backArrow from "@assets/images/arrow-left.svg";

export const CollectionPage = () => {
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
      <CollectionList />
    </>
  );
};
