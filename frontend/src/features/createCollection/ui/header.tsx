import { memo } from "react";
import arrow from "@assets/images/arrow-left.svg";
import check from "@assets/images/check.png";

type HeaderPropType = {
  save: () => void;
  back: () => void;
};

export const Header = memo(({ save, back }: HeaderPropType) => {
  return (
    <section className="sticky top-0 z-10 backdrop-blur-[30px]">
      <header className="flex justify-between py-4">
        <button
          className="w-[30px] md:w-[50px] cursor-pointer hover:scale-[1.1] transition-all hover:drop-shadow-[4px_4px_2px_rgba(0,0,0,0.7)]"
          onClick={() => back()}
        >
          <img src={arrow} alt="arrow" title="back" width={100} />
        </button>
        <h1 className="my-auto text-center font-comic text-2xl md:text-4xl">
          Создать коллекцию
        </h1>
        <button
          onClick={() => save()}
          className="w-[30px] md:w-[50px] cursor-pointer hover:scale-[1.1] transition-all hover:drop-shadow-[4px_4px_2px_rgba(0,0,0,0.7)]"
        >
          <img src={check} alt="save" title="save" width={100} />
        </button>
      </header>
      <hr className="border-gray-700" />
    </section>
  );
});
