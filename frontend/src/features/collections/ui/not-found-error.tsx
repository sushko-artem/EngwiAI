import { getErrorMessage } from "@shared/api";
import { memo } from "react";

export const NotFoundCollection = memo(({ error }: { error: unknown }) => (
  <div className="text-3xl font-jost text-fuchsia-800 flex flex-col h-[50vh] justify-center text-center">
    <span>Ошибка!</span> Коллекция не найдена!
    <span className="text-red-500 text-lg">
      Error: {getErrorMessage(error)}
    </span>
  </div>
));
