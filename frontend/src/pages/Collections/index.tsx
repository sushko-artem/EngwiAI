import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CollectionList } from "@features/collections";
import backArrow from "@assets/images/arrow-left.svg";
import { Layout } from "@widgets/layout";

export const CollectionPage = () => {
  const navigate = useNavigate();
  const back = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);
  return (
    <Layout
      headerProps={{
        title: "Мои модули",
        leftIcon: backArrow,
        leftIconTitle: "Вернуться на главную",
        leftIconAction: back,
      }}
    >
      <CollectionList />
    </Layout>
  );
};
