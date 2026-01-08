type ModalSummaryPropType = {
  moduleName: string;
  unknownTerms: number;
  moduleLength: number;
};

export const ModalSummary = ({
  moduleName,
  unknownTerms,
  moduleLength,
}: ModalSummaryPropType) => {
  return (
    <>
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
    </>
  );
};
