import { getErrorMessage } from "@shared/api";

export const NoCollectionError = ({ error }: { error: unknown }) => (
  <div
    data-testid="no-collection-error"
    className="text-3xl font-jost text-fuchsia-800 flex flex-col h-[50vh] justify-center text-center"
  >
    <h1>Ошибка! Коллекция не найдена!</h1>
    <span className="text-red-500 text-lg">
      Error: {getErrorMessage(error)}
    </span>
  </div>
);
