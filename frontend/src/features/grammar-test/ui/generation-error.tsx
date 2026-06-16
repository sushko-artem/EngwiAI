import { getErrorMessage } from "@shared/api";

export const GenerationError = ({ error }: { error: unknown }) => (
  <div
    data-testid="no-collection-error"
    className="text-3xl font-jost text-fuchsia-800 flex flex-col h-[50vh] justify-center text-center"
  >
    <h2>Ошибка генерации</h2>
    <p className="text-red-500 text-lg">Error: {getErrorMessage(error)}</p>
  </div>
);
