import { useNavigate } from "react-router-dom";

type ModalPropType = {
  collectionId: string;
  moduleName: string;
  moduleLength: number;
  unknownTerms: number;
  back: () => void;
};

export const ModalFlash = ({
  collectionId,
  moduleName,
  moduleLength,
  unknownTerms,
  back,
}: ModalPropType) => {
  const navigate = useNavigate();

  const editCollection = () => {
    navigate(`/edit-collection/${collectionId}`);
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-[10px] flex flex-col animate-blure transition-all">
      <section className="m-auto w-[60%] md:w-80 border-2 border-gray-300 rounded-lg p-4 bg-[rgba(255,255,235,1)] animate-appearing transition-all">
        <h1 className="text-center md:text-2xl text-fuchsia-700 font-roboto font-extrabold">
          Модуль "{moduleName}" пройден!
        </h1>
        <div className="mt-2 flex flex-col text-center font-jost md:text-xl">
          <span>
            Прогресс:{" "}
            {Math.floor(((moduleLength - unknownTerms) / moduleLength) * 100)}%
          </span>
          <span className="text-green-400">
            Знаю: {moduleLength - unknownTerms}
          </span>
          <span className="text-red-500">Изучил: {unknownTerms}</span>
        </div>
        <div className="flex flex-col m-auto mt-4 max-w-[80%]">
          <div
            onClick={editCollection}
            className="border-2 rounded-md bg-amber-100 p-1 text-center hover:cursor-pointer font-comic active:bg-amber-200 transition-all"
          >
            Редактировать модуль
          </div>
          <div
            onClick={back}
            className="mt-3 border-2 rounded-md bg-amber-100 p-1 text-center hover:cursor-pointer font-comic active:bg-amber-200 transition-all"
          >
            Выбрать другой модуль
          </div>
        </div>
      </section>
    </div>
  );
};
