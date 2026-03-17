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
import { useMemo } from "react";
import { useFlashCards } from "@features/collections/hooks";

export const FlashCardsContainer = ({
  collectionId,
}: {
  collectionId: string;
}) => {
  const {
    options,
    back,
    collection,
    index,
    isReversed,
    handleChosenStatus,
    handleReset,
    error,
    isLoading,
    ...props
  } = useFlashCards(collectionId);

  const headerProps = useMemo(
    () => ({
      leftIconTitle: "вернуться к списку коллекций",
      rightIconTitle: "настройки",
      rightIconAction: options,
      leftIconAction: back,
      leftIcon: backArrow,
      rightIcon: !error ? option : undefined,
      title: "Флэш - карты",
    }),
    [options, back, error],
  );

  return (
    <>
      <Header {...headerProps} />
      {isLoading && <Loader />}
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
          back={back}
          reset={handleReset}
        />
      )}
      {collection && props.isMenuOpen && (
        <MenuOptions
          onSwitchChange={props.handleSwitchChange}
          isMenuOpen={props.isMenuOpen}
          onClose={props.closeMenu}
          isReversed={isReversed}
          collectionId={collection.id}
          onDelete={props.handleDelete}
        />
      )}
    </>
  );
};
