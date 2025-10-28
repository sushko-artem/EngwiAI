import { memo } from "react";
import { Card, CardContent } from "@shared/ui/card";
import cross from "@assets/images/cross.webp";
import { useAppDispatch } from "@redux/hooks";
import { deleteCard, updateCard } from "@features/collections";

type EditableCardPropsType = {
  id: string;
  word: string;
  translation: string;
};

export const EditableCard = memo(
  ({ id, word, translation }: EditableCardPropsType) => {
    const dispatch = useAppDispatch();
    return (
      <Card className="relative my-1 text-center p-2 font-comic bg-[rgba(255,241,228,0.8)] shadow-[2px_3px_8px_rgba(0,0,0,0.5)] md:text-xl transition-all">
        <div className="absolute w-[18px] right-1.5 top-1.5 hover:scale-[1.2] cursor-pointer transition-all">
          <img
            onClick={() => dispatch(deleteCard(id))}
            width={100}
            src={cross}
            alt="delete"
            title="удалить"
          />
        </div>
        <CardContent className="p-2">
          <span className="text-fuchsia-800 font-bold">Термин</span>
          <input
            name="term"
            value={word}
            onChange={(e) =>
              dispatch(updateCard({ id, value: e.target.value, field: "word" }))
            }
            className="border-b-1 border-b-gray-600 outline-0 text-center focus:border-b-2 font-roboto my-2 w-full"
            type="text"
            autoComplete="off"
          />
          <span className="text-fuchsia-800 font-bold">Перевод</span>
          <input
            name="translation"
            value={translation}
            onChange={(e) =>
              dispatch(
                updateCard({
                  id,
                  value: e.target.value,
                  field: "translation",
                })
              )
            }
            className="border-b-1 border-b-gray-600 outline-0 text-center focus:border-b-2 font-roboto my-2 w-full"
            type="text"
            autoComplete="off"
          />
        </CardContent>
      </Card>
    );
  }
);
