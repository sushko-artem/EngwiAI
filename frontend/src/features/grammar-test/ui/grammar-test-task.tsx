import { memo } from "react";
import { Progress } from "shared/ui/progress";

type GrammarTestTaskPropType = {
  translation: string | undefined;
  index: number;
  testLength: number;
};

export const GrammarTestTask = memo(
  ({ translation, index, testLength }: GrammarTestTaskPropType) => {
    return (
      <>
        <div
          data-testid="test-sentence"
          className="text-xl lg:text-2xl font-roboto text-cyan-900 border-2 p-2 m-auto rounded-[8px] border-[#e5e7eb] bg-[rgba(255,241,228,0.8)]"
        >
          {translation || ""}
        </div>
        <div className="mt-2">
          <Progress
            className="bg-transparent"
            value={((index + 1) / testLength) * 100}
          />
          <span className="text-xs font-comic font-bold text-zinc-500">
            {index + 1}/{testLength}
          </span>
        </div>
      </>
    );
  },
);
