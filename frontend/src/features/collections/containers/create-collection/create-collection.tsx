import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModalConfirm, Header } from "@widgets/index";
import backArrow from "@assets/images/arrow-left.svg";
import save from "@assets/images/check.png";
import { EditableCollection } from "@entities/editableCollection";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
  clearCollection,
  selectEditableCollection,
  initDefaultCollection,
  useCreateCollectionMutation,
} from "@features/collections";
import { Loader } from "@shared/ui/loader";

export const CreateCollection = memo(() => {
  const collection = useAppSelector(selectEditableCollection);
  const [createCollection, { isLoading }] = useCreateCollectionMutation();
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [isWarning, setIsWarning] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const collectionRef = useRef(collection);

  useEffect(() => {
    collectionRef.current = collection;
  }, [collection]);

  useEffect(() => {
    dispatch(initDefaultCollection());
    return () => {
      dispatch(clearCollection());
    };
  }, [dispatch]);

  const saveCollection = useCallback(async () => {
    if (
      !collectionRef.current?.name.trim() ||
      collectionRef.current?.cards.some(
        (card) => !card.word.trim() || !card.translation.trim()
      )
    ) {
      setModalText("Все поля должны быть заполнены!");
      setIsWarning(true);
      setModalOpen(true);
    } else {
      try {
        const cards = collectionRef.current.cards.map((card) => ({
          id: card.id,
          word: card.word.trim(),
          translation: card.translation.trim(),
        }));
        await createCollection({
          name: collectionRef.current.name.trim(),
          cards,
        }).unwrap();
        navigate("/dashboard");
      } catch (error) {
        console.error("Ошибка создания коллекции:", error);
      }
    }
  }, [navigate, createCollection]);

  const back = useCallback(() => {
    if (
      collectionRef.current?.name.trim() ||
      collectionRef.current?.cards.find(
        (card) => card.word.trim() || card.translation.trim()
      )
    ) {
      setModalText("Все несохраненные данные будут потеряны!");
      setIsWarning(false);
      setModalOpen(true);
    } else {
      navigate("/dashboard");
    }
  }, [navigate]);

  const confirmAction = (value: boolean) => {
    if (value) {
      navigate("/dashboard");
    } else {
      setModalOpen(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      {isModalOpen && (
        <ModalConfirm
          modalText={modalText}
          confirmAction={confirmAction}
          isWarning={isWarning}
        />
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
      {collection ? (
        <EditableCollection
          collection={collection.cards}
          name={collection.name}
        />
      ) : (
        <Loader />
      )}
    </>
  );
});
