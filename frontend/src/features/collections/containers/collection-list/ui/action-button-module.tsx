import { memo } from "react";
import { useNavigate } from "react-router-dom";
import cross from "@assets/images/cross.webp";

type ActionButtonModulePropsType = {
  collectionName: string;
  id: string;
  onDelete(id: string): void;
};

export const ActionButtonModule = memo(
  ({ collectionName, id, onDelete }: ActionButtonModulePropsType) => {
    const navigate = useNavigate();

    const handleClick = () => {
      navigate(`/flash-cards/${id}`);
    };

    const handleDelete = async (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(id);
    };

    return (
      <div
        onClick={handleClick}
        className="relative w-[70%] md:w-[40%] border-2 p-4 rounded-md cursor-pointer border-gray-500 hover:shadow-[5px_5px_7px_rgba(0,0,0,0.5)] hover:scale-[1.05] transition-all active:border-gray-400"
      >
        <div className="absolute w-[18px] right-1.5 top-1.5 hover:scale-[1.2] cursor-pointer transition-all">
          <img
            onClick={handleDelete}
            width={100}
            src={cross}
            alt="delete"
            title="удалить"
          />
        </div>
        <span>{collectionName}</span>
      </div>
    );
  }
);
