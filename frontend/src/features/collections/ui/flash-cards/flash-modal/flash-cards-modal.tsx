import { useNavigate } from "react-router-dom";
import { FlashModalAction } from "./modal-action";
import { ModalSummary } from "./modal-summary";

type ModalPropType = {
  collectionId: string;
  moduleName: string;
  moduleLength: number;
  unknownTerms: number;
  back(): void;
  reset(): void;
};

export const ModalFlash = ({
  collectionId,
  moduleName,
  moduleLength,
  unknownTerms,
  back,
  reset,
}: ModalPropType) => {
  const navigate = useNavigate();

  const editCollection = () => {
    navigate(`/edit-collection/${collectionId}`);
  };
  return (
    <div className="fixed inset-0 z-50 backdrop-blur-[10px] flex flex-col animate-blure transition-all">
      <section className="m-auto w-[60%] md:w-80 border-2 border-gray-300 rounded-lg p-4 bg-[rgba(255,255,235,1)] animate-appearing transition-all">
        <ModalSummary
          unknownTerms={unknownTerms}
          moduleLength={moduleLength}
          moduleName={moduleName}
        />
        <div className="grid gap-2 m-auto mt-4 max-w-[80%]">
          <FlashModalAction content="Пройти модуль заново" onClick={reset} />
          <FlashModalAction
            content="Редактировать модуль"
            onClick={editCollection}
          />
          <FlashModalAction content="Выбрать другой модуль" onClick={back} />
        </div>
      </section>
    </div>
  );
};
