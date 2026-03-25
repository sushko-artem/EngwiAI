import type { VirtualCollectionIdType } from "@features/collections/helpers/virtual-collection-ident-helper";
import { cn } from "@shared/lib/utils";
import { useModal } from "@widgets/modal";
import { useNavigate } from "react-router-dom";

type IntervalLearningActionPropType = {
  type: VirtualCollectionIdType;
  collectionLength: number;
};

export const IntervalLearningAction = ({
  type,
  collectionLength,
}: IntervalLearningActionPropType) => {
  const navigate = useNavigate();
  const { warning } = useModal();
  const handleClick = () => {
    if (!collectionLength) {
      warning("В блоке нет ни одной флэш-карты!");
      return;
    }
    navigate(`/flash-cards/${type}`);
  };
  const color = type === "active" ? "green-600" : "red-600";
  return (
    <div
      className={cn(
        `flex flex-col text-center border-3 rounded-[5px] border-${color} p-2`,
      )}
    >
      <div>
        <span className={cn(`font-bold text-[50px] text-${color}`)}>
          {collectionLength}
        </span>
      </div>
      <div>
        <button
          onClick={handleClick}
          className={`border-2 border-${color} p-1 rounded-[3px] cursor-pointer font-roboto font-bold text-sm text-amber-100 bg-${color}`}
        >
          Начать
        </button>
      </div>
    </div>
  );
};
