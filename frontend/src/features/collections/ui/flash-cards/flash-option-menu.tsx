import { Switch } from "@shared/ui/switch";
import { useNavigate } from "react-router-dom";
import { OptionsMenu } from "@widgets/options-menu";

type MenuOptionsPropsType = {
  collectionId: string;
  isMenuOpen: boolean;
  isReversed: boolean;
  isVirtual: boolean;
  onClose: () => void;
  onSwitchChange: () => void;
  onDelete: () => void;
};

export const FlashOptionMenu = ({
  collectionId,
  isMenuOpen,
  isVirtual,
  onClose,
  onDelete,
  onSwitchChange,
  isReversed,
}: MenuOptionsPropsType) => {
  const navigate = useNavigate();

  const editCollection = () => {
    navigate(`/edit-collection/${collectionId}`);
  };

  return (
    <OptionsMenu isMenuOpen={isMenuOpen} onClose={onClose}>
      <>
        <div className="flex text-center justify-center p-4 font-jost">
          <Switch
            onCheckedChange={onSwitchChange}
            checked={isReversed}
            className="my-auto mr-2 cursor-pointer"
            id="switch-side"
          />
          <label className="cursor-pointer" htmlFor="switch-side">
            Перевернуть карточки
          </label>
        </div>
        {!isVirtual && (
          <>
            <div className="flex text-center justify-center p-4 font-jost  border-1">
              <button
                data-testid="menu-options-edit"
                onClick={editCollection}
                className="cursor-pointer"
              >
                Редактировать коллекцию
              </button>
            </div>
            <div className="flex text-center justify-center p-4 font-jost  border-1 border-t-0 rounded-b-md">
              <button
                data-testid="menu-options-delete"
                onClick={onDelete}
                className="cursor-pointer"
              >
                Удалить коллекцию
              </button>
            </div>
          </>
        )}
      </>
    </OptionsMenu>
  );
};
