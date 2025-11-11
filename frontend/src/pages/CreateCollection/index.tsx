import {
  CreateCollectionContainer,
  useCreateCollection,
} from "@features/collections";
import { Layout } from "@widgets/layout";
import backArrow from "@assets/images/arrow-left.svg";
import save from "@assets/images/check.png";

export const CreateCollectionPage = () => {
  const {
    isLoading,
    modaleMode,
    modaleText,
    collection,
    saveCollection,
    back,
    confirmAction,
  } = useCreateCollection();
  return (
    <Layout
      headerProps={{
        title: isLoading ? "Сохранение..." : "Новая коллекция",
        leftIconTitle: "вернуться на главную",
        rightIconTitle: "сохранить",
        rightIconAction: saveCollection,
        leftIconAction: back,
        leftIcon: backArrow,
        rightIcon: isLoading ? undefined : save,
      }}
    >
      <CreateCollectionContainer
        confirmAction={confirmAction}
        collection={collection!}
        modaleMode={modaleMode}
        modaleText={modaleText}
        isLoading={isLoading}
      />
    </Layout>
  );
};
