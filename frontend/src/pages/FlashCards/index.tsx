import { useParams } from "react-router-dom";
import {
  FlashCardsContainer,
  MenuOptions,
  ModalFlash,
  useFlashCards,
} from "@features/collections";
import { Layout } from "@widgets/layout";
import backArrow from "@assets/images/arrow-left.svg";
import option from "@assets/images/options.png";
import { ModalConfirm } from "@widgets/modal-confirm";

export const FlashCardsPage = () => {
  const { collectionId = "" } = useParams<{ collectionId?: string }>();
  const props = useFlashCards(collectionId);
  return (
    <Layout
      headerProps={{
        leftIconTitle: "вернуться к списку коллекций",
        rightIconTitle: "настройки",
        rightIconAction: props.options,
        leftIconAction: props.back,
        leftIcon: backArrow,
        rightIcon: option,
        title: "Флэш - карты",
      }}
    >
      <FlashCardsContainer
        isLoading={props.isLoading}
        progress={props.progress}
        index={props.index}
        currentCard={props.currentCard}
        isReversed={props.isReversed}
        collection={props.collection}
        error={props.error}
        handleChosenStatus={props.handleChosenStatus}
      />
      {props.collection && props.modaleMode && (
        <ModalConfirm
          mode={props.modaleMode}
          confirmAction={props.confirmAction}
        >
          {`Удалить коллекцию "${props.collection.name}"?`}
        </ModalConfirm>
      )}
      {props.collection && props.isModalOpen && (
        <ModalFlash
          collectionId={props.collection.id}
          moduleName={props.collection.name}
          moduleLength={props.collection.cards.length}
          unknownTerms={props.unmemTerms.length}
          back={props.back}
        />
      )}
      {props.collection && props.isMenuOpen && (
        <MenuOptions
          onSwitchChange={props.handleSwitchChange}
          isMenuOpen={props.isMenuOpen}
          onClose={props.closeMenu}
          isReversed={props.isReversed}
          collectionId={props.collection.id}
          onDelete={props.handleDelete}
        />
      )}
    </Layout>
  );
};
