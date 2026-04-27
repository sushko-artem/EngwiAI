import { ModalAction } from "@shared/ui/modal-action";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

type SpellTestResultModalPropType = {
  totalCards: number;
  rightAnswers: number;
  userMistakes: Record<string, string>;
  reset(): void;
};

export const SpellTestResultModal = ({
  totalCards,
  rightAnswers,
  userMistakes,
  reset,
}: SpellTestResultModalPropType) => {
  const navigate = useNavigate();
  const mistakes = Object.values(userMistakes);
  const progress = Math.floor((rightAnswers / totalCards) * 100);

  const getEvaluation = useMemo(() => {
    if (progress === 100) {
      return {
        text: "Идеально!",
        style: "text-green-500",
      };
    } else if (progress > 90 && progress < 100) {
      return {
        text: "Олично!",
        style: "text-green-500",
      };
    } else if (progress < 90 && progress > 70) {
      return {
        text: "Хорошо",
        style: "text-amber-500",
      };
    } else if (progress < 70 && progress > 50) {
      return {
        text: "Можно лучше",
        style: "text-amber-500",
      };
    } else if (progress < 50 && progress > 30) {
      return {
        text: "Удовлетворительно",
        style: "text-red-500",
      };
    } else {
      return {
        text: "Не сдавайся!",
        style: "text-red-500",
      };
    }
  }, [progress]);

  const backToSpellCheck = () => {
    navigate("/spell-check");
  };

  return (
    <div
      data-testid="spell-test-modal"
      className="fixed inset-0 z-50 backdrop-blur-[10px] flex flex-col animate-blure transition-all"
    >
      <section className="m-auto w-[60%] md:w-80 border-2 border-gray-300 rounded-lg p-4 bg-[rgba(255,255,235,1)] animate-appearing transition-all">
        <h1 className="text-center md:text-2xl text-fuchsia-700 font-roboto font-extrabold">
          {getEvaluation.text}
        </h1>
        <div className="mt-1 flex flex-col text-center font-jost md:text-xl">
          <div>
            Прогресс:{" "}
            <span className={`${getEvaluation.style} font-bold`}>
              {progress}%
            </span>
          </div>
        </div>
        <div
          data-testid="spell-test-modal-actions-container"
          className="grid gap-2 m-auto mt-4 max-w-[80%]"
        >
          {!!mistakes.length && (
            <ModalAction
              content="Подробный отчет"
              onClick={() => console.log(userMistakes)}
            />
          )}
          <ModalAction content="Пройти заново" onClick={reset} />
          <ModalAction content="Завершить" onClick={backToSpellCheck} />
        </div>
      </section>
    </div>
  );
};
