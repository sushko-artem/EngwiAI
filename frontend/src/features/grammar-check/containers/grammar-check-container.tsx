import { Header } from "@widgets/header";
import { useMemo } from "react";
import backArrow from "@assets/images/arrow-left.svg";
import { GrammarCheckDescription } from "../ui";

export const GrammarCheckContainer = () => {
  const headerProps = useMemo(
    () => ({
      title: "Грамматика",
      leftIcon: backArrow,
      leftIconTitle: "Вернуться на главную",
      leftIconAction: () => {},
    }),
    [],
  );

  const renderContent = () => {
    //   if (isLoading) return <Loader />;
    //   if (!collections?.length) return <NotASingleCollection />;
    return (
      <>
        <GrammarCheckDescription />
        <div className="text-center">
          <button
            data-testid="start-test"
            onClick={() => {}}
            className="border-zinc-500 rounded-[5px] cursor-pointer border-2 p-2 mt-4 font-comic font-bold text-cyan-900 bg-[rgb(168,145,124)] active:bg-[rgb(184,157,133)] transition-all"
          >
            Начать тест
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <Header {...headerProps} />
      {renderContent()}
    </>
  );
};
