import type { ICollectionResponse } from "@shared/api";
import { ChooseModuleAction } from "./choose-module-action";

type ChooseModuleListPropType = {
  collectionsList: ICollectionResponse[];
  onToggle(id: string): void;
  chosenIds: Set<string> | string;
};

export const ChooseModuleList = ({
  collectionsList,
  onToggle,
  chosenIds,
}: ChooseModuleListPropType) => {
  return (
    <div className="m-auto mt-6 mb-4 p-4 flex flex-col text-center border-zinc-400 border-2 rounded-[5px] md:w-[60%] lg:w-[40%] w-[80%] max-h-[50vh] overflow-y-auto">
      {collectionsList.map((collection) => (
        <ChooseModuleAction
          key={collection.id}
          id={collection.id}
          onClick={onToggle}
          isChosen={
            typeof chosenIds === "string"
              ? chosenIds === collection.id
              : chosenIds.has(collection.id)
          }
        >
          {collection.name}
        </ChooseModuleAction>
      ))}
    </div>
  );
};
