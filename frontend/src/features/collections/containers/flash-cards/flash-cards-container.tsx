import { memo, useCallback, useState } from "react";
import backArrow from "@assets/images/arrow-left.svg";
import option from "@assets/images/options.png";
import cross from "@assets/images/cross.webp";
import confirm from "@assets/images/confirm.png";
import { Progress } from "@shared/ui/progress";
import {
  ModalFlash,
  MenuOptions,
  useGetCollectionQuery,
} from "@features/collections";
import { useNavigate } from "react-router-dom";
import { Loader } from "@shared/ui/loader";
import { Header } from "@widgets/header";
import { FlashCard } from "@entities/flashCard";

type Card = {
  word: string;
  translation: string;
};

interface IFlashCardsContainerProps {
  collectionId: string;
}

export const FlashCardsContainer = memo(
  ({ collectionId }: IFlashCardsContainerProps) => {
    const { data: collection, isLoading } = useGetCollectionQuery(collectionId);
    const [unmemTerms, setUnmemTerms] = useState<Card[]>([]);
    const [isReversed, setIsReversed] = useState(false);
    const [index, setIndex] = useState(0);
    const [key, setKey] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const progress = collection
      ? ((index + 1) / collection.cards.length) * 100
      : null;
    const currentCard = collection?.cards[index];

    const back = useCallback(() => {
      navigate("/collections");
    }, [navigate]);

    const options = useCallback(() => {
      setIsMenuOpen((prev) => !prev);
    }, []);

    const closeMenu = () => {
      setIsMenuOpen(false);
    };

    const handleClick = (status: boolean) => {
      if (!collection || !currentCard) return;
      if (!status) {
        setUnmemTerms((card) => [...card, currentCard]);
      }
      if (index >= collection.cards.length - 1) {
        setIsModalOpen(true);
        return;
      }
      setKey((key) => key + 1);
      setIndex((index) => index + 1);
    };

    const handleSwitchChange = () => {
      setIsReversed((state) => !state);
    };

    if (!collection) {
      return <div>Коллекция не найдена!</div>;
    }
    if (!currentCard) return <div>Карточка не найдена</div>;

    return (
      <>
        {isLoading && <Loader />}
        {isModalOpen && (
          <ModalFlash
            collectionId={collection.id}
            moduleName={collection.name}
            moduleLength={collection.cards.length}
            unknownTerms={unmemTerms.length}
            back={back}
          />
        )}
        {isMenuOpen && (
          <MenuOptions
            onSwitchChange={handleSwitchChange}
            isMenuOpen={isMenuOpen}
            onClose={closeMenu}
            isReversed={isReversed}
            collectionId={collection.id}
          />
        )}
        <Header
          leftIconTitle="вернуться к списку коллекций"
          rightIconTitle="настройки"
          rightIconAction={options}
          leftIconAction={back}
          leftIcon={backArrow}
          rightIcon={option}
          title="Флэш - карты"
        />
        <h1 className="text-center text-fuchsia-800 font-comic text-xl md:text-2xl mt-8">
          {collection.name}
        </h1>
        <div className="flex flex-col align-middle justify-center mt-10">
          <FlashCard key={key} card={currentCard} isReversed={isReversed} />
        </div>
        <div className="mt-3 m-auto max-w-[350px] md:max-w-[500px] text-center text-sm font-comic">
          <Progress className="bg-transparent" value={progress} />
          <span>
            {index + 1}/{collection.cards.length}
          </span>
        </div>
        <div className="flex mt-4 align-middle justify-around md:justify-evenly">
          <div
            onClick={() => handleClick(false)}
            className="flex border-2 rounded-lg border-red-400 bg-[rgba(255,241,228,0.5)] active:bg-[rgba(255,241,228,0.2)] hover:shadow-[3px_5px_6px_rgba(0,0,0,0.3)] hover:scale-[1.01] cursor-pointer transition-all"
          >
            <div className="my-auto w-[50px]">
              <img src={cross} width={100} alt="не знаю" />
            </div>
            <span className="my-auto p-2 font-roboto font-bold">Изучено</span>
          </div>
          <div
            onClick={() => handleClick(true)}
            className="flex border-2 rounded-lg border-green-400 bg-[rgba(255,241,228,0.5)] active:bg-[rgba(255,241,228,0.2)] hover:shadow-[3px_5px_6px_rgba(0,0,0,0.3)] hover:scale-[1.01] cursor-pointer transition-all"
          >
            <div className="my-auto w-[60px] pl-2">
              <img src={confirm} width={100} alt="знаю" />
            </div>
            <span className="my-auto p-2 font-roboto font-bold">Знаю!</span>
          </div>
        </div>
      </>
    );
  }
);
