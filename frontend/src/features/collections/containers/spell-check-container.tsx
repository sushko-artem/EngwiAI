import { useCallback, useMemo } from "react";
import backArrow from "@assets/images/arrow-left.svg";
import { Header } from "@widgets/header";
import { useSpellCheck } from "../hooks";
import {
  ChooseModuleList,
  ChooseVisibleSide,
  NotASingleCollection,
  SpellCheckDescription,
} from "../ui";
import { Loader } from "@shared/ui/loader";
import { useNavigate } from "react-router-dom";

export const SpellCheckContainer = () => {
  const navigate = useNavigate();
  const {
    back,
    collections,
    isLoading,
    chosenIds,
    toggleChoosenModule,
    getChosenModulesIds,
    warning,
    visibleSide,
    setVisibleSide,
  } = useSpellCheck();
  const headerProps = useMemo(
    () => ({
      title: "Орфография",
      leftIcon: backArrow,
      leftIconTitle: "Вернуться на главную",
      leftIconAction: back,
    }),
    [back],
  );

  const startTest = useCallback(async () => {
    const modules = getChosenModulesIds();
    if (!modules.length) {
      warning("Ни одного модуля не выбрано!");
    } else {
      navigate("/spell-check/test", { state: { modules, visibleSide } });
    }
  }, [getChosenModulesIds, warning, navigate, visibleSide]);

  const renderContent = () => {
    if (isLoading) return <Loader />;
    if (!collections?.length) return <NotASingleCollection />;
    return (
      <>
        <SpellCheckDescription />
        <ChooseModuleList
          collectionsList={collections}
          onToggle={toggleChoosenModule}
          chosenIds={chosenIds}
        />
        <div className="mb-4 text-center">
          <ChooseVisibleSide
            sideValue={visibleSide}
            onChange={setVisibleSide}
          />
        </div>
        <div className="text-center">
          <button
            onClick={startTest}
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
