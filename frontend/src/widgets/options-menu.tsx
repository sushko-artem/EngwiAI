import { useRef, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";

type OptionsMenuPropType = {
  isMenuOpen: boolean;
  onClose(): void;
  children: React.ReactNode;
};

export const OptionsMenu = ({
  isMenuOpen,
  onClose,
  children,
}: OptionsMenuPropType) => {
  const menuRef = useRef<HTMLDivElement>(null);
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

  return (
    <>
      <animated.div
        data-testid="menu-overlay"
        style={overlaySpring}
        className="fixed inset-0 bg-black z-40"
        onClick={onClose}
      />
      <animated.div
        data-testid="menu-options"
        ref={menuRef}
        style={{
          opacity: menuSpring.opacity,
          transform: menuSpring.y.to((y) => `translate(-50%, ${y}px)`),
          scale: menuSpring.scale,
        }}
        className="fixed top-0 left-1/2 z-50 w-[60%] max-w-md bg-[rgba(244,244,230,1)] rounded-b-md"
      >
        {children}
      </animated.div>
    </>
  );
};
