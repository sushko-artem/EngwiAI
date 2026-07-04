import { Loader } from "@shared/ui/loader";
import backArrow from "@assets/images/arrow-left.svg";
import option from "@assets/images/options.png";
import {
  ChosenStatusButtonContainer,
  FlashCardsCollectionView,
  FlashOptionMenu,
  ModalFlash,
  ProgressBar,
} from "../ui/";
import { Header } from "@widgets/header";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useFlashCards } from "../lib";
import { NoCollectionError } from "@entities/collection/ui";

export const FlashCardsContainer = () => {
  const {
    options,
    collection,
    index,
    isReversed,
    handleChosenStatus,
    handleReset,
    error,
    isLoading,
    ...props
  } = useFlashCards();
  const navigate = useNavigate();
  const isLoadingOrDeleting = props.isDeleting || (isLoading && !collection);
  const isNoCollectionError = !collection && !isLoading && error;
  const isModalOpen = collection && props.isModalOpen;
  const isMenuOpen = collection && props.isMenuOpen;

  const handleBack = useCallback(() => {
    if (props.isVirtual) {
      navigate("/dashboard");
    } else {
      navigate("/collections");
    }
  }, [navigate, props.isVirtual]);

  const headerProps = useMemo(
    () => ({
      leftIconTitle: "вернуться к списку коллекций",
      rightIconTitle: "настройки",
      rightIconAction: options,
      leftIconAction: handleBack,
      leftIcon: backArrow,
      rightIcon: !error ? option : undefined,
      title: "Флэш - карты",
    }),
    [options, handleBack, error],
  );

  return (
    <>
      <Header {...headerProps} />
      {collection && (
        <main>
          <FlashCardsCollectionView
            collection={collection}
            index={index}
            isReversed={isReversed}
          />
          <ProgressBar value={collection.cards.length} index={index} />
          <ChosenStatusButtonContainer
            handleChosenStatus={handleChosenStatus}
          />
        </main>
      )}
      {isNoCollectionError && <NoCollectionError error={error} />}
      {isModalOpen && (
        <ModalFlash
          collectionId={collection.id}
          moduleName={collection.name}
          moduleLength={collection.cards.length}
          unknownTerms={props.unmemTerms}
          updateStatus={props.updateStatus}
          isVirtual={props.isVirtual}
          reset={handleReset}
        />
      )}
      {isMenuOpen && (
        <FlashOptionMenu
          onSwitchChange={props.handleSwitchChange}
          isMenuOpen={props.isMenuOpen}
          onClose={props.closeMenu}
          isReversed={isReversed}
          isVirtual={props.isVirtual}
          collectionId={collection.id}
          onDelete={props.handleDelete}
        />
      )}
      {isLoadingOrDeleting && <Loader />}
    </>
  );
};
