import { OptionsMenu } from "@widgets/options-menu";
import { Switch } from "@shared/ui/switch";

type SpellTestOptionsMenuPropType = {
  isMenuOpen: boolean;
  isGroupMuted(group: "spellTest"): boolean;
  toggleGroup(group: "spellTest"): void;
  onClose(): void;
  reset(): void;
};

export const SpellTestOptionsMenu = ({
  isMenuOpen,
  onClose,
  reset,
  isGroupMuted,
  toggleGroup,
}: SpellTestOptionsMenuPropType) => {
  const isSoundsOn = !isGroupMuted("spellTest");
  const toggleSounds = () => {
    toggleGroup("spellTest");
  };
  return (
    <OptionsMenu isMenuOpen={isMenuOpen} onClose={onClose}>
      <>
        <div className="flex text-center justify-center p-4 font-jost">
          <Switch
            data-testid="switch-sound"
            onCheckedChange={toggleSounds}
            checked={isSoundsOn}
            className="my-auto mr-2 cursor-pointer"
            id="switch-sound"
          />
          <label className="cursor-pointer" htmlFor="switch-sound">
            Звук
          </label>
        </div>
        <button
          className="flex text-center justify-center p-4 font-jost  border-1 border-t-1 rounded-b-md cursor-pointer w-full"
          data-testid="menu-options-reset"
          onClick={reset}
        >
          Начать заново
        </button>
      </>
    </OptionsMenu>
  );
};
