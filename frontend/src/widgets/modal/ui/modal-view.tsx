import cross from "@assets/images/cross.webp";
import check from "@assets/images/confirm.png";
import { ModalActionButton } from "./modal-action-button";
import type { ConfirmActionsType, ModalPropType } from "@entities/modal/types";

const ConfirmIcon = <img src={check} alt="confirm" title="да" width={100} />;
const DenyIcon = <img src={cross} alt="close" title="отмена" width={100} />;

export const ModalView = ({
  mode,
  message,
  actions,
}: ModalPropType & ConfirmActionsType) => {
  const actionsVariant = () => (
    <>
      {mode === "CONFIRM" && actions.confirm && (
        <>
          <ModalActionButton onClick={actions.confirm}>
            {ConfirmIcon}
          </ModalActionButton>
          <ModalActionButton onClick={actions.cancel}>
            {DenyIcon}
          </ModalActionButton>
        </>
      )}
      {mode === "WARN" && (
        <ModalActionButton onClick={actions.cancel}>
          {DenyIcon}
        </ModalActionButton>
      )}
    </>
  );

  return (
    <div
      data-testid="modal-view"
      className="fixed inset-0 z-50 backdrop-blur-[5px] flex flex-col animate-blure transition-all"
    >
      <section className="relative m-auto w-[60%] md:w-80 border-2 border-gray-400 rounded-lg p-4 bg-[radial-gradient(circle_at_15%_20%,rgba(255,180,120,0.35)_0%,transparent_45%),radial-gradient(circle_at_85%_80%,rgba(120,60,30,0.5)_0%,transparent_50%),radial-gradient(circle_at_50%_50%,rgba(200,140,90,0.2)_0%,transparent_60%),linear-gradient(135deg,#3e2723_0%,#5d4037_50%,#4e342e_100%)] animate-appearing transition-all">
        <h1 className="text-center text-mauve-300 font-roboto font-extrabold">
          {message}
        </h1>
        <div data-testid="modal-actions" className="mt-4 flex justify-around">
          {actionsVariant()}
        </div>
      </section>
    </div>
  );
};
