import { memo, useRef, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { Switch } from "@shared/ui/switch";
import { useNavigate } from "react-router-dom";

type MenuOptionsPropsType = {
  collectionId: string;
  isMenuOpen: boolean;
  isReversed: boolean;
  onClose: () => void;
  onSwitchChange: () => void;
  onDelete: () => void;
};

export const MenuOptions = memo(
  ({
    collectionId,
    isMenuOpen,
    onClose,
    onDelete,
    onSwitchChange,
    isReversed,
  }: MenuOptionsPropsType) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [menuSpring, menuApi] = useSpring(() => ({
      from: {
        opacity: 0,
        y: -100,
        scale: 0.9,
      },
      config: {
        tension: 300,
        friction: 30,
      },
    }));

    const [overlaySpring, overlayApi] = useSpring(() => ({
      from: { opacity: 0 },
      config: { duration: 200 },
    }));

    useEffect(() => {
      const handlePointerDown = (e: PointerEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          onClose();
        }
      };

      if (isMenuOpen) {
        document.addEventListener("pointerdown", handlePointerDown);
        menuApi.start({
          opacity: 1,
          y: 0,
          scale: 1,
        });
        overlayApi.start({ opacity: 0.5 });
      } else {
        menuApi.start({
          opacity: 0,
          y: -100,
          scale: 0.9,
        });
        overlayApi.start({ opacity: 0 });
      }

      return () => {
        document.removeEventListener("pointerdown", handlePointerDown);
      };
    }, [isMenuOpen, menuApi, overlayApi, onClose]);

    const editCollection = () => {
      navigate(`/edit-collection/${collectionId}`);
    };

    return (
      <>
        <animated.div
          style={overlaySpring}
          className="fixed inset-0 bg-black z-40"
          onClick={onClose}
        />
        <animated.div
          ref={menuRef}
          style={{
            opacity: menuSpring.opacity,
            transform: menuSpring.y.to((y) => `translate(-50%, ${y}px)`),
            scale: menuSpring.scale,
          }}
          className="fixed top-0 left-1/2 z-50 w-[60%] max-w-md bg-[rgba(244,244,230,1)] rounded-b-md"
        >
          <div className="flex text-center justify-center p-4 font-jost">
            <Switch
              onCheckedChange={onSwitchChange}
              checked={isReversed}
              className="my-auto mr-2 cursor-pointer"
              id="switch side"
            />
            <label className="cursor-pointer" htmlFor="switch side">
              Перевернуть карточки
            </label>
          </div>
          <div className="flex text-center justify-center p-4 font-jost  border-1">
            <button onClick={editCollection} className="cursor-pointer">
              Редактировать коллекцию
            </button>
          </div>
          <div className="flex text-center justify-center p-4 font-jost  border-1 border-t-0 rounded-b-md">
            <button onClick={onDelete} className="cursor-pointer">
              Удалить коллекцию
            </button>
          </div>
        </animated.div>
      </>
    );
  }
);
