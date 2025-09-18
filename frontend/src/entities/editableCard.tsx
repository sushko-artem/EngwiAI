import { Card, CardContent } from "@shared/ui/card";
import cross from "@assets/images/cross.webp";
import { memo } from "react";

export type EditableCardType = {
  id: string;
  word: string;
  translation: string;
  isDeleting?: boolean;
  deleteCard: (id: string) => void;
  setValue: (value: string, id: string, field: "word" | "translation") => void;
};

export const EditableCard = memo(
  ({
    id,
    word,
    translation,
    isDeleting = false,
    setValue,
    deleteCard,
  }: EditableCardType) => {
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
            <input
              name="term"
              value={word}
              onChange={(e) => setValue(e.target.value, id, "word")}
              className="border-b-1 border-b-gray-600 outline-0 text-center focus:border-b-2 font-roboto my-2 w-full"
              type="text"
              autoComplete="off"
            />
            <span>Перевод</span>
            <input
              name="translation"
              value={translation}
              onChange={(e) => setValue(e.target.value, id, "translation")}
              className="border-b-1 border-b-gray-600 outline-0 text-center focus:border-b-2 font-roboto my-2 w-full"
              type="text"
              autoComplete="off"
            />
          </CardContent>
        </Card>
      </div>
    );
  }
);
