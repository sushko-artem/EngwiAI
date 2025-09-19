import cross from "@assets/images/cross.webp";
import check from "@assets/images/modalConfirm.png";

type ModalPropType = {
  confirmAction: (res: boolean) => void;
  modalText: string;
  isWarning?: boolean;
};

export const ModalConfirm = ({
  confirmAction,
  modalText,
  isWarning,
}: ModalPropType) => {
  return (
    <div className="fixed inset-0 z-50 backdrop-blur-[8px] flex flex-col animate-blure transition-all">
      <section className="relative m-auto w-[60%] md:w-80 border-2 border-gray-400 rounded-lg p-4 bg-[rgba(255,255,255,1)] animate-appearing transition-all">
        <h1 className="text-center font-roboto font-extrabold">{modalText}</h1>
        {!isWarning && (
          <div className="mt-4 flex justify-around">
            <div
              onClick={() => confirmAction(true)}
              className="w-10 flex cursor-pointer hover:drop-shadow-lg hover:scale-125  transition-all"
            >
              <img src={check} alt="confirm" title="Yes!" width={100} />
            </div>
            <div
              onClick={() => confirmAction(false)}
              className="w-10 flex cursor-pointer hover:drop-shadow-lg hover:scale-125 transition-all"
            >
              <img src={cross} alt="deny" title="No!" width={100} />
            </div>
          </div>
        )}
        {isWarning && (
          <div className="mt-4 flex justify-around">
            <div
              onClick={() => confirmAction(false)}
              className="w-10 flex cursor-pointer hover:drop-shadow-lg hover:scale-125 transition-all"
            >
              <img src={cross} alt="close" title="закрыть" width={100} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
