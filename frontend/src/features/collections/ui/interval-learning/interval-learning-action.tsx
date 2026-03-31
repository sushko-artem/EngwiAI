import {
  type VirtualCollectionIdType,
  VIRTUAL_COLLECTIONS,
} from "@features/collections/helpers/virtual-collection-ident-helper";
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
  const isActive = type === VIRTUAL_COLLECTIONS.ACTIVE;
  const handleClick = () => {
    if (!collectionLength) {
      warning("В блоке нет ни одной флэш-карты!");
      return;
    }
    navigate(`/flash-cards/${type}`);
  };
  return (
    <div
      data-testid="interval-learning-box"
      className={`flex flex-col text-center border-3 rounded-[5px] p-2 ${isActive ? "border-green-600" : "border-red-600"}`}
    >
      <div>
        <span
          data-testid="collection-length"
          className={`font-bold text-[50px] lg:text-[100px] ${isActive ? "text-green-600" : "text-red-600"}`}
        >
          {collectionLength}
        </span>
      </div>
      <div>
        <button
          data-testid="interval-action-button"
          onClick={handleClick}
          className={`border-2 p-1 rounded-[3px] cursor-pointer font-roboto font-bold text-sm lg:text-2xl text-amber-100 hover:scale-[1.1] transition-all ${isActive ? "border-green-600 bg-green-600" : "border-red-600 bg-red-600"}`}
        >
          Начать
        </button>
      </div>
    </div>
  );
};
