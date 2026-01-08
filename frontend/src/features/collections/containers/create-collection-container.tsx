import { useMemo } from "react";
import { useAppSelector } from "@redux/hooks";
import { selectEditableCollection } from "@features/collections/model";
import { useCreateCollection } from "@features/collections/hooks";
import { Loader } from "@shared/ui/loader";
import { EditableCollection } from "@features/collections/ui";
import backArrow from "@assets/images/arrow-left.svg";
import save from "@assets/images/check.png";
import { Header } from "@widgets/header";

export const CreateCollectionContainer = () => {
  const collection = useAppSelector(selectEditableCollection);
  const { isLoading, saveCollection, back } = useCreateCollection(collection);

  const headerProps = useMemo(
    () => ({
      title: isLoading ? "Сохранение..." : "Новая коллекция",
      leftIconTitle: "вернуться на главную",
      rightIconTitle: "сохранить",
      rightIconAction: saveCollection,
      leftIconAction: back,
      leftIcon: backArrow,
      rightIcon: isLoading ? undefined : save,
    }),
    [isLoading, saveCollection, back]
  );

  if (!collection) {
    return <Loader />;
  }

  return (
    <>
      {isLoading && <Loader />}
      <Header {...headerProps} />
      <EditableCollection
        collection={collection.cards}
        name={collection.name}
      />
    </>
  );
};
