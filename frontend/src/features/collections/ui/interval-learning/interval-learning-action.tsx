import type { VirtualCollectionIdType } from "@features/collections/helpers/virtual-collection-ident-helper";
import { cn } from "@shared/lib/utils";

type IntervalLearningActionPropType = {
  type: VirtualCollectionIdType;
  collectionLength: number;
};

export const IntervalLearningAction = ({
  type,
  collectionLength,
}: IntervalLearningActionPropType) => {
  const color = type === "active" ? "border-green-600" : "border-red-600";
  return (
    <div
      className={cn(
        `flex flex-col text-center border-3 rounded-[5px] ${color}`,
      )}
    >
      {collectionLength}
    </div>
  );
};
