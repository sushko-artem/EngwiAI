import { memo, useCallback } from "react";
import { Card, CardContent } from "@shared/ui/card";
import { useAppDispatch } from "@redux/hooks";
import { deleteCard, updateCard } from "@features/collections";
import type { ICard } from "@shared/api";
import { CardInputField } from "..";
import { DeleteCross } from "@shared/ui/cross-delete";

export const EditableCard = memo(({ id, word, translation }: ICard) => {
  const dispatch = useAppDispatch();

  const handleChange = useCallback(
    (value: string, field: "word" | "translation") => {
      dispatch(updateCard({ id, value, field }));
    },
    [dispatch, id]
  );

  const handleDelete = useCallback(() => {
    dispatch(deleteCard(id));
  }, [dispatch, id]);

  return (
    <Card className="relative my-1 text-center p-2 font-comic bg-[rgba(255,241,228,0.8)] shadow-[2px_3px_8px_rgba(0,0,0,0.5)] md:text-xl transition-all">
      <DeleteCross onDelete={handleDelete} />
      <CardContent className="p-2">
        <CardInputField
          name="word"
          text={word}
          onChange={handleChange}
          label="Термин"
        />
        <CardInputField
          name="translation"
          text={translation}
          onChange={handleChange}
          label="Перевод"
        />
      </CardContent>
    </Card>
  );
});
