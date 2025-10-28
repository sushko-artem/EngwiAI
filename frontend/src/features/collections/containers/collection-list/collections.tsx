import {
  ActionButtonModule,
  useGetCollectionsQuery,
} from "@features/collections";
import { Loader } from "@shared/ui/loader";
import { Link } from "react-router-dom";

export const CollectionList = () => {
  const { data: collections, isLoading } = useGetCollectionsQuery();

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

  return (
    <>
      <div className="flex flex-col items-center gap-5 text-center font-comic text-xl text-fuchsia-800 mt-10 my-auto">
        {collections!.map((item) => (
          <ActionButtonModule
            key={item.id}
            collectionName={item.name}
            id={item.id}
          />
        ))}
      </div>
    </>
  );
};
