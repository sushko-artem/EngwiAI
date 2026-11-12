import { memo, useEffect, useState } from "react";
import { rateLimit } from "@shared/lib";

type ButtonContainerPropType = {
  handleClick(): boolean;
};

export const StartTestButtonContainer = memo(
  ({ handleClick }: ButtonContainerPropType) => {
    const [disabled, setDisabled] = useState(() => rateLimit.isBlocked());
    const [secondsLeft, setSecondsLeft] = useState(() =>
      rateLimit.getSecondsLeft(),
    );

    useEffect(() => {
      if (!disabled) return;
      const timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            rateLimit.clear();
            setDisabled(false);
            clearInterval(timer);
            return rateLimit.duration;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }, [disabled]);

    return (
      <div className="text-center grid mt-4">
        <button
          data-testid="start-test"
          disabled={disabled}
          onClick={handleClick}
          className="m-auto min-w-30 max-w-fit border-zinc-500 rounded-[5px] cursor-pointer border-2 mt-1 p-2 font-comic font-bold text-cyan-900 bg-[rgb(168,145,124)] active:bg-[rgb(184,157,133)] transition-all disabled:bg-[rgb(168,145,124)] disabled:cursor-default disabled:blur-xs"
        >
          Начать тест
        </button>
        {disabled && (
          <div
            data-testid="rate-limit-timer"
            className="flex items-center justify-center gap-2 mt-2 animate-pulse"
          >
            <span className="w-2 h-2 bg-fuchsia-800 rounded-full" />
            <span className="text-xs text-fuchsia-800 font-medium">
              Следующая попытка через {secondsLeft} сек.
            </span>
          </div>
        )}
      </div>
    );
  },
);
