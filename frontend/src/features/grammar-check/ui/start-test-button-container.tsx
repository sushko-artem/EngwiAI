import { memo, useEffect, useState } from "react";

type ButtonContainerPropType = {
  handleClick(): boolean;
};

export const RATE_LIMIT_KEY = "grammar_test_button_disabled";
export const RATE_LIMIT_TIME_KEY = "grammar_test_button_time";

export const StartTestButtonContainer = memo(
  ({ handleClick }: ButtonContainerPropType) => {
    const [disabled, setDisabled] = useState(() => {
      return sessionStorage.getItem(RATE_LIMIT_KEY) === "true";
    });
    const [secondsLeft, setSecondsLeft] = useState(() => {
      const savedTime = sessionStorage.getItem(RATE_LIMIT_TIME_KEY);
      if (!savedTime) return 60;
      const elapsed = Math.floor((Date.now() - Number(savedTime)) / 1000);
      return Math.max(0, 60 - elapsed);
    });

    const onClick = () => {
      sessionStorage.setItem(RATE_LIMIT_KEY, "true");
      sessionStorage.setItem(RATE_LIMIT_TIME_KEY, String(Date.now()));
      const shouldDisable = handleClick();
      if (!shouldDisable) return;
      setDisabled(true);
      setSecondsLeft(60);
    };

    useEffect(() => {
      if (!disabled) return;
      const timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            sessionStorage.removeItem(RATE_LIMIT_KEY);
            sessionStorage.removeItem(RATE_LIMIT_TIME_KEY);
            setDisabled(false);
            clearInterval(timer);
            return 60;
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
          onClick={onClick}
          className="m-auto min-w-[120px] max-w-fit border-zinc-500 rounded-[5px] cursor-pointer border-2 mt-1 p-2 font-comic font-bold text-cyan-900 bg-[rgb(168,145,124)] active:bg-[rgb(184,157,133)] transition-all disabled:bg-[rgb(168,145,124)] disabled:cursor-default disabled:blur-[4px]"
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
