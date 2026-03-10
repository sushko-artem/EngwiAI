import cross from "@assets/images/cross.webp";
import check from "@assets/images/modalConfirm.png";
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
      <section className="relative m-auto w-[60%] md:w-80 border-2 border-gray-400 rounded-lg p-4 bg-[rgba(255,255,255,1)] animate-appearing transition-all">
        <h1 className="text-center font-roboto font-extrabold">{message}</h1>
        <div data-testid="modal-actions" className="mt-4 flex justify-around">
          {actionsVariant()}
        </div>
      </section>
    </div>
  );
};
