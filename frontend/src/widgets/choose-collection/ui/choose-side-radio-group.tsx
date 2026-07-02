import { Label } from "@shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@shared/ui/radio-group";
import { memo } from "react";

export type SideValueType = "word" | "translation";

type CooseVisibleSidePropType = {
  sideValue: SideValueType;
  onChange(value: SideValueType): void;
};

export const ChooseVisibleSide = memo(
  ({ sideValue, onChange }: CooseVisibleSidePropType) => {
    return (
      <div className="mb-4 text-center">
        <RadioGroup
          onValueChange={onChange}
          value={sideValue}
          className="m-auto flex justify-evenly lg:justify-center lg:gap-16 w-full"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem
              data-testid="word"
              className="cursor-pointer border-cyan-900 border-2"
              value="word"
              id="r1"
            />
            <Label
              className="cursor-pointer font-bold font-comic text-md text-cyan-900"
              htmlFor="r1"
            >
              Термин
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem
              data-testid="translation"
              className="cursor-pointer border-cyan-900 border-2"
              value="translation"
              id="r2"
            />
            <Label
              className="cursor-pointer font-bold font-comic text-md text-cyan-900"
              htmlFor="r2"
            >
              Перевод
            </Label>
          </div>
        </RadioGroup>
      </div>
    );
  },
);
