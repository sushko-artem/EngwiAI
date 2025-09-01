import { memo, useCallback, useRef, useState } from "react";
import { NewCard } from "../ui/new-card";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { ModalConfirm } from "@shared/ui/modal-confirm";
import { Header } from "@shared/ui/header";
import backArrow from "@assets/images/arrow-left.svg";
import save from "@assets/images/check.png";

export type CollectionStateType = {
  id: string;
  term: string;
  translation: string;
  isDeleting?: boolean;
};

const MODAL_TEXT = "Все несохранённые данные будут утеряны!";

export const CreateCollection = memo(() => {
  const [collection, setCollection] = useState<CollectionStateType[]>([
    { id: nanoid(), term: "", translation: "" },
    { id: nanoid(), term: "", translation: "" },
  ]);
  const [collectionName, setCollectionName] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const endRef = useRef<HTMLDivElement>(null);

  const setValue = useCallback(
    (value: string, id: string, field: "term" | "translation") => {
      setCollection((prevCollection) =>
        prevCollection.map((card) =>
          card.id === id ? { ...card, [field]: value } : card
        )
      );
    },
    []
  );

  const saveCollection = useCallback(() => {
    console.log(collection);
  }, [collection]);

  const back = useCallback(() => {
    if (
      collection.length &&
      collection.some((item) => item.term || item.translation)
    ) {
      setModalOpen(true);
    } else navigate("/dashboard");
  }, [navigate, collection]);

  const addCard = () => {
    setCollection((prevCollection) => [
      ...prevCollection,
      { id: nanoid(), term: "", translation: "" },
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
    if (value) {
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
        <ModalConfirm modalText={MODAL_TEXT} confirmAction={confirmAction} />
      )}
      <Header
        rightIconAction={saveCollection}
        leftIconAction={back}
        leftIcon={backArrow}
        rightIcon={save}
        title="Создать коллекцию"
      />
      <div className="m-auto text-center grid gap-0.5 max-w-[500px] w-[70%] sm:w-[60%] md:w-[50%]">
        <div className="flex flex-col align-middle justify-center text-center my-4">
          <span className="font-comic text-fuchsia-800 text-xl md:text-2xl">
            Имя коллекции:
          </span>
          <input
            onBlur={(e) => setCollectionName(e.target.value)}
            autoComplete="off"
            name="name"
            type="text"
            className="self-center block w-[80%] border-b-1 border-b-gray-600 outline-0 text-center focus:border-b-2 font-roboto md:text-xl"
          />
        </div>
        <div className="grid grid-cols-1 gap-2 transition-all duration-300 ease-in-out">
          {collection.map((item) => (
            <NewCard
              isDeleting={item.isDeleting}
              setValue={setValue}
              deleteCard={deleteCard}
              term={item.term}
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
