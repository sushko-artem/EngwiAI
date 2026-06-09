import { memo, useId } from "react";
import { Label } from "shared/ui/label";
import { RadioGroup, RadioGroupItem } from "shared/ui/radio-group";

type DifficultyType = "beginner" | "intermediate" | "advanced";

type ChooseDifficultyLevelPropType = {
  level: DifficultyType;
  onChange(level: DifficultyType): void;
};

export const ChooseDifficultyLevel = memo(
  ({ level, onChange }: ChooseDifficultyLevelPropType) => {
    const id = useId();
    return (
      <div className="mb-4 text-center flex flex-col ">
        <span className="underline text-fuchsia-800 font-bold mb-1">
          Уровень сложности:
        </span>
        <RadioGroup
          onValueChange={onChange}
          value={level}
          className="m-auto gap-0.5"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem
              data-testid="beginner"
              className="cursor-pointer border-cyan-900 border-2"
              value="beginner"
              id={`${id}-beginner`}
            />
            <Label
              className="cursor-pointer font-bold font-comic text-md text-cyan-900"
              htmlFor={`${id}-beginner`}
            >
              Начинающий
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem
              data-testid="intermediate"
              className="cursor-pointer border-cyan-900 border-2"
              value="intermediate"
              id={`${id}-intermediate`}
            />
            <Label
              className="cursor-pointer font-bold font-comic text-md text-cyan-900"
              htmlFor={`${id}-intermediate`}
            >
              Средний
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem
              data-testid="advanced"
              className="cursor-pointer border-cyan-900 border-2"
              value="advanced"
              id={`${id}-advanced`}
            />
            <Label
              className="cursor-pointer font-bold font-comic text-md text-cyan-900"
              htmlFor={`${id}-advanced`}
            >
              Продвинутый
            </Label>
          </div>
        </RadioGroup>
      </div>
    );
  },
);
