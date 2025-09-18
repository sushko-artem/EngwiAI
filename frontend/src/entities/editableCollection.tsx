import { EditableCard, type EditableCardType } from "@entities/editableCard";
import { nanoid } from "nanoid";
import { memo, useCallback, useRef } from "react";

export type CollectionStateType = Pick<
  EditableCardType,
  "id" | "word" | "translation" | "isDeleting"
> & {
  isNew?: boolean;
  isUpdated?: boolean;
};

type EditableCollectionPropsType = {
  name: string;
  collection: CollectionStateType[];
  onNameChange: (name: string) => void;
  onCollectionChange: (
    collection:
      | CollectionStateType[]
      | ((prev: CollectionStateType[]) => CollectionStateType[])
  ) => void;
  onDelete?: (originalId: string) => void;
};

export const EditableCollection = memo(
  ({
    name,
    collection,
    onNameChange,
    onCollectionChange,
    onDelete,
  }: EditableCollectionPropsType) => {
    const endRef = useRef<HTMLDivElement>(null);

    const setName = useCallback(
      (name: string) => {
        onNameChange(name);
      },
      [onNameChange]
    );

    const setValue = useCallback(
      (value: string, id: string, field: "word" | "translation") => {
        onCollectionChange((prevCollection) => {
          return prevCollection.map((card) => {
            if (card.id === id) {
              const updatedCard = { ...card, [field]: value };
              if (!card.isNew && card[field] !== value) {
                updatedCard.isUpdated = true;
              }
              return updatedCard;
            }
            return card;
          });
        });
      },
      [onCollectionChange]
    );

    const addCard = useCallback(() => {
      onCollectionChange((prevCollection) => [
        ...prevCollection,
        { id: nanoid(), word: "", translation: "", isNew: true },
      ]);

      setTimeout(() => {
        endRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 50);
    }, [onCollectionChange]);

    const deleteCard = useCallback(
      (id: string) => {
        onCollectionChange((prevCollection) =>
          prevCollection.map((card) =>
            card.id === id ? { ...card, isDeleting: true } : card
          )
        );

        setTimeout(() => {
          if (onDelete) {
            onDelete(id);
          }
          onCollectionChange((prevCollection) =>
            prevCollection.filter((card) => card.id !== id)
          );
        }, 250);
      },
      [onCollectionChange, onDelete]
    );

    return (
      <div className="m-auto text-center grid gap-0.5 max-w-[500px] w-[70%] sm:w-[60%] md:w-[50%]">
        <div className="flex flex-col align-middle justify-center text-center my-4">
          <span className="mb-2 font-comic text-fuchsia-800 text-xl md:text-2xl">
            Имя коллекции:
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            name="name"
            type="text"
            className="self-center block w-[80%] border-b-1 border-b-gray-600 outline-0 text-center focus:border-b-2 font-roboto md:text-xl placeholder:font-jost placeholder:text-red-700/50"
          />
        </div>
        <div className="grid grid-cols-1 gap-2 transition-all duration-300 ease-in-out">
          {collection.map((item) => (
            <EditableCard
              isDeleting={item.isDeleting}
              setValue={setValue}
              deleteCard={deleteCard}
              word={item.word}
              translation={item.translation}
              key={item.id}
              id={item.id}
            />
          ))}
        </div>
        <div className="fixed bottom-4 right-4 z-50 lg:right-60">
          <div
            onClick={addCard}
            className="flex justify-center items-center text-2xl rounded-[50%] text-white bg-blue-400 w-[50px] h-[50px] cursor-pointer hover:bg-blue-500 transition-all shadow-lg"
          >
            +
          </div>
        </div>
        <div ref={endRef} className="h-0" />
      </div>
    );
  }
);
