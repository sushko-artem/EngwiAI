import { memo } from "react";
import { cn } from "@shared/lib/utils";

export type HeaderPropType = {
  title: string;
  rightIcon?: string;
  rightIconTitle?: string;
  leftIconTitle: string;
  leftIcon: string;
  rightIconAction?: () => void;
  leftIconAction: () => void;
};

export const Header = memo(
  ({
    rightIconAction,
    leftIconAction,
    leftIconTitle,
    rightIconTitle,
    leftIcon,
    rightIcon,
    title,
  }: HeaderPropType) => {
    return (
      <section className="sticky top-0 z-5 backdrop-blur-[30px]">
        <header className="flex justify-between py-4">
          <button
            data-testid="leftIconAction"
            className="w-[30px] md:w-[50px] cursor-pointer hover:scale-[1.1] transition-all hover:drop-shadow-[4px_4px_2px_rgba(0,0,0,0.7)]"
            onClick={leftIconAction}
          >
            <img src={leftIcon} alt="icon" title={leftIconTitle} width={100} />
          </button>
          <h1 className="my-auto text-center font-comic text-2xl md:text-4xl">
            {title}
          </h1>
          <button
            data-testid="rightIconAction"
            onClick={rightIconAction ? rightIconAction : undefined}
            className={cn(
              "w-[30px] md:w-[50px] ",
              rightIcon &&
                "cursor-pointer hover:scale-[1.1] transition-all hover:drop-shadow-[4px_4px_2px_rgba(0,0,0,0.7)]",
            )}
          >
            {rightIcon && (
              <img
                src={rightIcon}
                alt="icon"
                title={rightIconTitle}
                width={100}
              />
            )}
          </button>
        </header>
        <hr className="border-gray-700" />
      </section>
    );
  },
);
