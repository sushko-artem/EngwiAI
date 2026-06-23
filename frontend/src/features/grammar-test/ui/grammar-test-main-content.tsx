import { Progress } from "@shared/ui/progress";
import type { GrammarDataType } from "../lib/helpers";
import type { SoundNameType } from "@shared/constants/sounds";

type GrammarTestContentPropType = {
  index: number;
  sentences: GrammarDataType;
  onAnswer(userAnswer: string, correctAnswer: string): SoundNameType;
};

export const GrammarTestContent = ({
  index,
  sentences,
  onAnswer,
}: GrammarTestContentPropType) => {
  const handleAnswer = () => {
    onAnswer(
      sentences.shuffledSentences[index].join(" "), // ОТВЕТ ПОЛЬЗОВАТЕЛЯ
      sentences.joinedSentences[index],
    );
  };
  return (
    <div className="m-auto text-center w-[80%] md:w-[60%] lg:w-[50%]">
      <div
        data-testid="test-sentence"
        className="text-xl lg:text-2xl font-roboto text-cyan-900 border-2 p-2 m-auto rounded-[8px] border-[#e5e7eb] bg-[rgba(255,241,228,0.8)]"
      >
        {sentences.translations[index]}
      </div>
      <div className="mt-2">
        <Progress
          className="bg-transparent"
          value={((index + 1) / sentences.translations.length) * 100}
        />
        <span className="text-xs font-comic font-bold text-zinc-500">
          {index + 1}/{sentences.translations.length}
        </span>
      </div>
      <div className="mt-4 mb-4">
        <span className="font-jost text-fuchsia-700">
          Составьте предложение из данных слов:
        </span>
        <div className="p-2 border-1 rounded-[5px] outline-0 text-center focus:border-2 font-roboto w-full resize-none overflow-y-auto bg-[rgba(255,241,228,0.8)] lg:text-xl">
          {sentences.shuffledSentences[index]}
        </div>
      </div>
      <button
        data-testid="grammar-test-answer-button"
        onClick={handleAnswer}
        className="border-zinc-500 rounded-[5px] cursor-pointer border-2 p-2 mt-4 font-comic font-bold text-cyan-900 bg-[rgb(168,145,124)] active:bg-[rgb(184,157,133)] transition-all"
      >
        Ответить
      </button>
    </div>
  );
};
