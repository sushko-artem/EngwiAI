import { memo } from "react";
import { useNavigate } from "react-router-dom";

type ActionButtonModulePropsType = {
  collectionName: string;
  id: string;
};

export const ActionButtonModule = memo(
  ({ collectionName, id }: ActionButtonModulePropsType) => {
    const navigate = useNavigate();

    const handleClick = () => {
      navigate(`/flash-cards/${id}`);
    };

    return (
      <div
        onClick={handleClick}
        className="w-[70%] md:w-[40%] border-2 p-4 rounded-md cursor-pointer border-gray-500 hover:shadow-[5px_5px_7px_rgba(0,0,0,0.5)] hover:scale-[1.05] transition-all active:border-gray-400"
      >
        <span>{collectionName}</span>
      </div>
    );
  }
);
