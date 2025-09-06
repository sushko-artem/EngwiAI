import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { Header } from "@shared/ui/header";
import backArrow from "@assets/images/arrow-left.svg";
import { useCollections } from "@features/dashboard/hooks/useCollections";
import { Loader } from "@shared/ui/loader";
import { ActionButtonModule } from "../ui/action-button-module";

export const CollectionList = () => {
  const navigate = useNavigate();
  const { collections, loading } = useCollections();
  const back = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  return (
    <>
      {loading && <Loader />}
      <Header
        title="Мои модули"
        leftIcon={backArrow}
        leftIconTitle="вернуться на главную"
        leftIconAction={back}
      />
      <div className="flex flex-col items-center gap-5 text-center font-comic text-xl text-fuchsia-800 mt-10 my-auto">
        {collections.map((item) => (
          <ActionButtonModule
            key={item.id}
            collectionName={item.name}
            id={item.id}
          />
        ))}
      </div>
    </>
  );
};
