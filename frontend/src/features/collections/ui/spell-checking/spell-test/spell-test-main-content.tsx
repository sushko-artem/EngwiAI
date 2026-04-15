import type { ICard } from "@shared/api";
import { Progress } from "@shared/ui/progress";
import TextareaAutosize from "react-textarea-autosize";

type SpellTestMainContentPropType = {
  collection: ICard[];
  index: number;
};

export const SpellTestMainContent = ({
  collection,
  index,
}: SpellTestMainContentPropType) => {
  return (
    <div className="m-auto text-center w-[80%] md:w-[60%] lg:w-[50%]">
      <div className="text-xl lg:text-2xl font-bold font-roboto text-red-600 border-2 p-2 m-auto rounded-[8px] border-[#e5e7eb] bg-[rgba(255,241,228,0.8)]">
        {collection[index].word}
      </div>
      <div className="mt-2">
        <Progress
          className="bg-transparent"
          value={((index + 1) / collection.length) * 100}
        />
        <span className="text-xs font-comic font-bold text-zinc-500">
          {index + 1}/{collection.length}
        </span>
      </div>
      <div className="mt-4">
        <span className="font-jost text-fuchsia-700">Перевод:</span>
        <TextareaAutosize
          className="p-2 border-1 border-[#d34af1] rounded-[5px] outline-0 text-center focus:border-2 font-roboto w-full resize-none overflow-y-auto bg-[rgba(255,241,228,0.8)] text-xl lg:text-2xl"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(233,220,230,0.2) transparent",
            scrollbarGutter: "stable",
          }}
          minRows={1}
          maxRows={4}
          maxLength={250}
          autoComplete="off"
        />
      </div>
    </div>
  );
};
