import cross from "@assets/images/cross.webp";
import check from "@assets/images/modalConfirm.png";
import { ChosenStatusButton } from "./chosen-status-button";
import { memo } from "react";

const DenyIcon = <img src={cross} width={100} alt="не знаю" />;
const ConfirmIcon = <img src={check} width={100} alt="знаю" />;

type ChosenStatusContainerPropType = {
  handleChosenStatus(status: boolean): void;
};

export const ChosenStatusButtonContainer = memo(
  ({ handleChosenStatus }: ChosenStatusContainerPropType) => {
    return (
      <div className="flex mt-4 align-middle justify-around md:justify-evenly">
        <ChosenStatusButton
          onClick={handleChosenStatus}
          content="Изучено"
          status={false}
          ClassName="border-red-400"
        >
          {DenyIcon}
        </ChosenStatusButton>
        <ChosenStatusButton
          onClick={handleChosenStatus}
          content="Знаю!"
          status={true}
          ClassName="border-green-400"
        >
          {ConfirmIcon}
        </ChosenStatusButton>
      </div>
    );
  }
);
