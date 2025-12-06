import { memo, useCallback } from "react";
import { Card, CardContent } from "@shared/ui/card";
import cross from "@assets/images/cross.webp";
import { useAppDispatch } from "@redux/hooks";
import { deleteCard, updateCard } from "@features/collections";
import type { ICard } from "@shared/api";
import { CardInputField } from "..";

export const EditableCard = memo(({ id, word, translation }: ICard) => {
  const dispatch = useAppDispatch();

  const handleChange = useCallback(
    (value: string, field: "word" | "translation") => {
      dispatch(updateCard({ id, value, field }));
    },
    [dispatch, id]
  );
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
        <CardInputField name="word" text={word} onChange={handleChange} />
        <span className="text-fuchsia-800 font-bold">Перевод</span>
        <CardInputField
          name="translation"
          text={translation}
          onChange={handleChange}
        />
      </CardContent>
    </Card>
  );
});
