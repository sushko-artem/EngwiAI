import { memo, useId } from "react";
import { Label } from "shared/ui/label";
import { RadioGroup, RadioGroupItem } from "shared/ui/radio-group";

type CountType = "5" | "7" | "10";

type ChooseCountPropType = {
  count: CountType;
  onChange(count: CountType): void;
};

export const ChooseCount = memo(({ count, onChange }: ChooseCountPropType) => {
  const id = useId();
  return (
    <div className="mb-4 text-center ">
      <span className="underline text-fuchsia-800 font-bold mb-1">
        Количество предложений:
      </span>
      <RadioGroup
        onValueChange={onChange}
        value={count}
        className="m-auto gap-5 flex justify-center lg:gap-16 w-full"
      >
        <div className="flex items-center gap-1">
          <RadioGroupItem
            data-testid="5_tenses"
            className="cursor-pointer border-cyan-900 border-2"
            value="5"
            id={`${id}-5`}
          />
          <Label
            className="cursor-pointer font-bold font-comic text-md text-cyan-900"
            htmlFor={`${id}-5`}
          >
            5
          </Label>
        </div>
        <div className="flex items-center gap-1">
          <RadioGroupItem
            data-testid="7_tenses"
            className="cursor-pointer border-cyan-900 border-2"
            value="7"
            id={`${id}-7`}
          />
          <Label
            className="cursor-pointer font-bold font-comic text-md text-cyan-900"
            htmlFor={`${id}-7`}
          >
            7
          </Label>
        </div>
        <div className="flex items-center gap-1">
          <RadioGroupItem
            data-testid="10_tenses"
            className="cursor-pointer border-cyan-900 border-2"
            value="10"
            id={`${id}-10`}
          />
          <Label
            className="cursor-pointer font-bold font-comic text-md text-cyan-900"
            htmlFor={`${id}-10`}
          >
            10
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
});
