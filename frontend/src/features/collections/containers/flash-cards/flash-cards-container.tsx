import { memo } from "react";
import cross from "@assets/images/cross.webp";
import confirm from "@assets/images/confirm.png";
import { Progress } from "@shared/ui/progress";
import { Loader } from "@shared/ui/loader";
import { FlashCard } from "@entities/flashCard";
import type { ICard, ICollectionCardsResponse } from "@shared/api";
import { NotFoundCollection } from "@features/collections/ui/not-found-error";

interface IFlashCardsContainerProps {
  isLoading: boolean;
  isReversed: boolean;
  currentCard: Omit<ICard, "id">;
  progress: number | null;
  index: number;
  collection: ICollectionCardsResponse | undefined;
  error: unknown;
  handleChosenStatus(value: boolean): void;
}

export const FlashCardsContainer = memo(
  ({
    collection,
    isLoading,
    isReversed,
    currentCard,
    progress,
    index,
    error,
    handleChosenStatus,
  }: IFlashCardsContainerProps) => {
    if (!collection && !isLoading) {
      return <NotFoundCollection error={error} />;
    }
    return (
      <>
        {isLoading ? (
          <Loader />
        ) : (
          <section>
            <h1 className="text-center text-fuchsia-800 font-comic text-xl md:text-2xl mt-8">
              {collection?.name}
            </h1>
            <div className="flex flex-col align-middle justify-center mt-10">
              <FlashCard
                key={index}
                card={currentCard}
                isReversed={isReversed}
              />
            </div>
            <div className="mt-3 m-auto max-w-[350px] md:max-w-[500px] text-center text-sm font-comic">
              <Progress className="bg-transparent" value={progress} />
              <span>
                {index + 1}/{collection?.cards.length}
              </span>
            </div>
            <div className="flex mt-4 align-middle justify-around md:justify-evenly">
              <div
                onClick={() => handleChosenStatus(false)}
                className="flex border-2 rounded-lg border-red-400 bg-[rgba(255,241,228,0.5)] active:bg-[rgba(255,241,228,0.2)] hover:shadow-[3px_5px_6px_rgba(0,0,0,0.3)] hover:scale-[1.01] cursor-pointer transition-all"
              >
                <div className="my-auto w-[50px]">
                  <img src={cross} width={100} alt="не знаю" />
                </div>
                <span className="my-auto p-2 font-roboto font-bold">
                  Изучено
                </span>
              </div>
              <div
                onClick={() => handleChosenStatus(true)}
                className="flex border-2 rounded-lg border-green-400 bg-[rgba(255,241,228,0.5)] active:bg-[rgba(255,241,228,0.2)] hover:shadow-[3px_5px_6px_rgba(0,0,0,0.3)] hover:scale-[1.01] cursor-pointer transition-all"
              >
                <div className="my-auto w-[60px] pl-2">
                  <img src={confirm} width={100} alt="знаю" />
                </div>
                <span className="my-auto p-2 font-roboto font-bold">Знаю!</span>
              </div>
            </div>
          </section>
        )}
      </>
    );
  }
);
