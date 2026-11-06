import { memo, useEffect, useRef, useState } from "react";
import { cn } from "@shared/lib/utils";

export type HeaderPropType = {
  title: string | React.ReactNode;
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
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const isTitle = useRef(leftIconTitle === "EngwiAI");

    useEffect(() => {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY.current && currentScrollY > 20) {
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY.current) {
          setIsVisible(true);
        }

        lastScrollY.current = currentScrollY;
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
      <section
        className={cn(
          "sticky top-0 z-5 backdrop-blur-[30px] transition-all duration-300 ease-in-out",
          !isVisible && "-translate-y-full",
        )}
      >
        <header
          className={cn(
            !isTitle.current ? "py-4" : "py-4 xs:py-0",
            "flex justify-between",
          )}
        >
          <button
            data-testid="leftIconAction"
            className={cn(
              isTitle.current ? "w-15 " : "w-7.5",
              "xs:w-auto cursor-pointer hover:scale-[1.1] transition-all hover:drop-shadow-[4px_4px_2px_rgba(0,0,0,0.7)]",
            )}
            onClick={leftIconAction}
          >
            <img
              src={leftIcon}
              alt="icon"
              title={leftIconTitle}
              width={isTitle.current ? 100 : "60px"}
            />
          </button>
          <h1 className="my-auto text-center font-comic text-2xl md:text-4xl">
            {title}
          </h1>
          <button
            data-testid="rightIconAction"
            onClick={rightIconAction ? rightIconAction : undefined}
            className={cn(
              "w-7.5 xs:w-auto",
              rightIcon &&
                "cursor-pointer hover:scale-[1.1] transition-all hover:drop-shadow-[4px_4px_2px_rgba(0,0,0,0.7)]",
            )}
          >
            {rightIcon && (
              <img
                src={rightIcon}
                alt="icon"
                title={rightIconTitle}
                width={60}
              />
            )}
          </button>
        </header>
        <hr className="border-gray-700" />
      </section>
    );
  },
);
