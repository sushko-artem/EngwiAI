import { VIRTUAL_COLLECTIONS } from "@features/collections/helpers/virtual-collection-ident-helper";
import { IntervalLearningAction } from "./interval-learning-action";

type IntervalActionsBlockPropType = {
  moduleLength: {
    active: number;
    inactive: number;
  };
};

export const IntervalActionsBlock = ({
  moduleLength,
}: IntervalActionsBlockPropType) => {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 m-auto md:max-w-[50%] max-w-[80%] mb-4 mt-8">
      <IntervalLearningAction
        type={VIRTUAL_COLLECTIONS.ACTIVE}
        collectionLength={moduleLength.active}
      />
      <IntervalLearningAction
        type={VIRTUAL_COLLECTIONS.INACTIVE}
        collectionLength={moduleLength.inactive}
      />
    </div>
  );
};
