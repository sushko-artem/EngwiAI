import { memo, useCallback, useRef, useState } from "react";
import { NewCard } from "@entities/new-card/new-card";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { ModalConfirm } from "@shared/ui/modal-confirm";
import { Header } from "@shared/ui/header";
import backArrow from "@assets/images/arrow-left.svg";
import save from "@assets/images/check.png";
import { useCollections } from "@features/dashboard/hooks/useCollections";

export type CollectionStateType = {
  id: string;
  word: string;
  translation: string;
  isDeleting?: boolean;
};

export const CreateCollection = memo(() => {
  const { createCollection } = useCollections();
  const [collection, setCollection] = useState<CollectionStateType[]>([
    { id: nanoid(), word: "", translation: "" },
    { id: nanoid(), word: "", translation: "" },
  ]);
  const [collectionName, setCollectionName] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [defaultName, setDefaultName] = useState("");
  const [isEmptyFields, setIsEmptyFields] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const navigate = useNavigate();
  const endRef = useRef<HTMLDivElement>(null);

  const setValue = useCallback(
    (value: string, id: string, field: "word" | "translation") => {
      setCollection((prevCollection) =>
        prevCollection.map((card) =>
          card.id === id ? { ...card, [field]: value } : card
        )
      );
    },
    []
  );

  const saveCollection = useCallback(async () => {
    if (collection.length < 1) return;
    if (!collectionName.trim()) {
      setDefaultName("Придумайте название!");
      return;
    }

    const hasEmptyFields = collection.some(
      (item) => !item.word.trim() || !item.translation.trim()
    );

    if (hasEmptyFields) {
      setIsEmptyFields(true);
      setModalText("Все поля карточек должны быть заполнены!");
      setModalOpen(true);
      return;
    }

    try {
      const cards = collection.map((card) => ({
        word: card.word.trim(),
        translation: card.translation.trim(),
      }));

      const res = await createCollection({
        name: collectionName.trim(),
        cards,
      });

      if (res.success) {
        navigate("/dashboard");
      } else {
        console.error("Ошибка:", res.error);
      }
    } catch (err) {
      console.error("Ошибка запроса:", err);
    }
  }, [collection, collectionName, createCollection, navigate]);

  const back = useCallback(() => {
    setIsEmptyFields(false);
    if (
      collection.length &&
      collection.some((item) => item.word || item.translation)
    ) {
      setModalText("Все несохранённые данные будут утеряны!");
      setModalOpen(true);
    } else navigate("/dashboard");
  }, [navigate, collection]);

  const addCard = () => {
    setCollection((prevCollection) => [
      ...prevCollection,
      { id: nanoid(), word: "", translation: "" },
    ]);
    setTimeout(() => {
      if (endRef.current) {
        endRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 50);
  };

  const confirmAction = (value: boolean) => {
    if (!isEmptyFields && value) {
      navigate("/dashboard");
    } else {
      setModalOpen(false);
    }
  };

  const deleteCard = useCallback((id: string) => {
    setCollection((prevCollection) =>
      prevCollection.map((item) =>
        item.id === id ? { ...item, isDeleting: true } : item
      )
    );
    setTimeout(() => {
      setCollection((prevCollection) =>
        prevCollection.filter((item) => item.id !== id)
      );
    }, 250);
  }, []);

  return (
    <>
      {isModalOpen && (
        <ModalConfirm modalText={modalText} confirmAction={confirmAction} />
      )}
      <Header
        leftIconTitle="вернуться на главную"
        rightIconTitle="сохранить"
        rightIconAction={saveCollection}
        leftIconAction={back}
        leftIcon={backArrow}
        rightIcon={save}
        title="Новая коллекция"
      />
      <div className="m-auto text-center grid gap-0.5 max-w-[500px] w-[70%] sm:w-[60%] md:w-[50%]">
        <div className="flex flex-col align-middle justify-center text-center my-4">
          <span className="font-comic text-fuchsia-800 text-xl md:text-2xl">
            Имя коллекции:
          </span>
          <input
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            onFocus={() => setShowPlaceholder(false)}
            onBlur={(e) => {
              if (!e.target.value) setShowPlaceholder(true);
            }}
            placeholder={showPlaceholder ? defaultName : ""}
            autoComplete="off"
            name="name"
            type="text"
            className="self-center block w-[80%] border-b-1 border-b-gray-600 outline-0 text-center focus:border-b-2 font-roboto md:text-xl placeholder:font-jost placeholder:text-red-700"
          />
        </div>
        <div className="grid grid-cols-1 gap-2 transition-all duration-300 ease-in-out">
          {collection.map((item) => (
            <NewCard
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
    </>
  );
});
