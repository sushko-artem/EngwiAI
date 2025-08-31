import { Card, CardContent } from "@shared/ui/card";
import cross from "@assets/images/cross.webp";
import { memo, useRef } from "react";
import type { CollectionStateType } from "../containers/create-collection";

type CardInfoPropType = {
  isDeleting?: boolean;
  deleteCard: (id: string) => void;
  setValue: (value: string, id: string, field: "term" | "translation") => void;
};

export const NewCard = memo(
  ({
    id,
    term,
    translation,
    isDeleting = false,
    setValue,
    deleteCard,
  }: CollectionStateType & CardInfoPropType) => {
    const termRef = useRef<HTMLDivElement>(null);
    const transRef = useRef<HTMLDivElement>(null);
    return (
      <div
        className={`
        transition-all duration-300 ease-in-out
        ${
          isDeleting
            ? "max-h-0 opacity-0 -mt-2 -mb-2 scale-y-0"
            : "max-h-[200px] opacity-100 scale-y-100"
        }
      `}
      >
        <Card className="relative my-1 text-center p-2 font-comic bg-[rgba(255,241,228,0.8)] shadow-[2px_3px_8px_rgba(0,0,0,0.5)] md:text-xl transition-all">
          <div className="absolute w-[18px] right-1.5 top-1.5 hover:scale-[1.2] cursor-pointer transition-all">
            <img
              onClick={() => deleteCard(id)}
              width={100}
              src={cross}
              alt="delete"
              title="удалить"
            />
          </div>
          <CardContent className="p-2">
            <span>Термин</span>
            <div
              onBlur={() =>
                setValue(termRef.current?.textContent as string, id, "term")
              }
              ref={termRef}
              className="border-b-1 border-b-gray-600 outline-0 text-center focus:border-b-2 font-roboto my-2"
              contentEditable="true"
              role="textbox"
              aria-multiline="false"
              defaultValue={term}
            ></div>
            <span>Перевод</span>
            <div
              onBlur={() =>
                setValue(
                  transRef.current?.textContent as string,
                  id,
                  "translation"
                )
              }
              ref={transRef}
              className="border-b-1 border-b-gray-600 outline-0 text-center focus:border-b-2 font-roboto my-2"
              contentEditable="true"
              role="textbox"
              aria-multiline="false"
              defaultValue={translation}
            ></div>
          </CardContent>
        </Card>
      </div>
    );
  }
);
