import { memo } from "react";

type HeaderPropType = {
  title: string;
  rightIcon: string;
  leftIcon: string;
  rightIconAction: () => void;
  leftIconAction: () => void;
};

export const Header = memo(
  ({
    rightIconAction,
    leftIconAction,
    leftIcon,
    rightIcon,
    title,
  }: HeaderPropType) => {
    return (
      <section className="sticky top-0 z-10 backdrop-blur-[30px]">
        <header className="flex justify-between py-4">
          <button
            className="w-[30px] md:w-[50px] cursor-pointer hover:scale-[1.1] transition-all hover:drop-shadow-[4px_4px_2px_rgba(0,0,0,0.7)]"
            onClick={() => leftIconAction()}
          >
            <img src={leftIcon} alt="arrow" title="back" width={100} />
          </button>
          <h1 className="my-auto text-center font-comic text-2xl md:text-4xl">
            {title}
          </h1>
          <button
            onClick={() => rightIconAction()}
            className="w-[30px] md:w-[50px] cursor-pointer hover:scale-[1.1] transition-all hover:drop-shadow-[4px_4px_2px_rgba(0,0,0,0.7)]"
          >
            <img src={rightIcon} alt="save" title="save" width={100} />
          </button>
        </header>
        <hr className="border-gray-700" />
      </section>
    );
  }
);
