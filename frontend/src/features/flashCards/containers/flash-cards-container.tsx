import { useState } from "react";
import { Header } from "@shared/ui/header";
import backArrow from "@assets/images/arrow-left.svg";
import option from "@assets/images/options.png";
import cross from "@assets/images/cross.webp";
import confirm from "@assets/images/confirm.png";
import { Card } from "../ui/card";

type Card = {
  term: string;
  translation: string;
};

export const FlashCardsContainer = () => {
  const [cards] = useState<Card[]>([
    {
      term: "Собака",
      translation: "Dog",
    },
    {
      term: "Кот",
      translation: "Cat",
    },
    { term: "Обезьяна", translation: "Monkey" },
  ]);
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState(0);

  const currentCard = cards[index];

  const back = () => {};

  const options = () => {};

  const handleClick = () => {
    if (index >= cards.length - 1) return;
    setKey((key) => key + 1);
    setIndex((state) => state + 1);
  };

  return (
    <>
      <Header
        rightIconAction={options}
        leftIconAction={back}
        leftIcon={backArrow}
        rightIcon={option}
        title="Флэш - карты"
      />
      <h1 className="text-center underline text-fuchsia-800 font-comic text-xl md:text-2xl my-8">
        Название коллекции
      </h1>
      <div className="flex flex-col align-middle justify-center my-10">
        <Card key={key} card={currentCard} />
      </div>
      <div className="flex align-middle justify-around md:justify-evenly">
        <div
          onClick={handleClick}
          className="flex border-2 rounded-lg border-red-400 bg-[rgba(255,241,228,0.5)] active:bg-[rgba(255,241,228,0.2)] hover:shadow-[3px_5px_6px_rgba(0,0,0,0.3)] hover:scale-[1.01] cursor-pointer transition-all"
        >
          <div className="my-auto w-[50px]">
            <img src={cross} width={100} alt="не знаю" />
          </div>
          <span className="my-auto p-2 font-roboto font-bold">Изучено</span>
        </div>
        <div
          onClick={handleClick}
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
};
