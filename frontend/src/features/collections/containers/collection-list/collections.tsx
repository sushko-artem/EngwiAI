import {
  ActionButtonModule,
  useDeleteCollectionMutation,
  useGetCollectionsQuery,
} from "@features/collections";
import { Loader } from "@shared/ui/loader";
import { ModalConfirm } from "@widgets/modal-confirm";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

export const CollectionList = () => {
  const { data: collections, isLoading } = useGetCollectionsQuery();
  const [deleteCollection] = useDeleteCollectionMutation();
  const [id, setId] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");

  const onDelete = useCallback((id: string, name: string) => {
    setModalText(`Удалить коллекцию "${name}"?`);
    setModalOpen(true);
    setId(id);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (collections?.length === 0) {
    return (
      <div className="flex flex-col text-center font-roboto text-2xl text-fuchsia-800 mt-10">
        <span>Ни одного модуля пока не создано!</span>
        <Link
          className="w-fit mx-auto mt-4 underline text-gray-700 font-jost hover:scale-[1.1]"
          to={"/create-collection"}
        >
          создать
        </Link>
      </div>
    );
  }

  const confirmAction = async (value: boolean) => {
    if (value) {
      setModalOpen(false);
      try {
        await deleteCollection(id as string).unwrap();
      } catch (error) {
        console.error(error);
      }
    } else {
      setModalOpen(false);
      setId(null);
    }
  };

  return (
    <>
      {isModalOpen && (
        <ModalConfirm modalText={modalText} confirmAction={confirmAction} />
      )}
      <div className="flex flex-col items-center gap-5 text-center font-comic text-xl text-fuchsia-800 mt-10 my-auto">
        {collections!.map((item) => (
          <ActionButtonModule
            key={item.id}
            collectionName={item.name}
            id={item.id}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
};
