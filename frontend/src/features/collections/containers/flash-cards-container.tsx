import { Loader } from "@shared/ui/loader";
import backArrow from "@assets/images/arrow-left.svg";
import option from "@assets/images/options.png";
import {
  ChosenStatusButtonContainer,
  FlashCardsCollectionView,
  MenuOptions,
  ModalFlash,
  NoCollectionError,
  ProgressBar,
} from "@features/collections/ui";
import { Header } from "@widgets/header";
import { useCallback, useMemo } from "react";
import { useFlashCards } from "@features/collections/hooks";
import { useNavigate } from "react-router-dom";

export const FlashCardsContainer = ({
  collectionId,
}: {
  collectionId: string;
}) => {
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
  } = useFlashCards(collectionId);
  const navigate = useNavigate();

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
      {isLoading && !collection && <Loader />}
      {!collection && !isLoading && <NoCollectionError error={error} />}
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
      {collection && props.isModalOpen && (
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
      {collection && props.isMenuOpen && (
        <MenuOptions
          onSwitchChange={props.handleSwitchChange}
          isMenuOpen={props.isMenuOpen}
          onClose={props.closeMenu}
          isReversed={isReversed}
          isVirtual={props.isVirtual}
          collectionId={collection.id}
          onDelete={props.handleDelete}
        />
      )}
    </>
  );
};
