import { getErrorMessage } from "@shared/api";
import { Link } from "react-router-dom";

export const GenerationError = ({ error }: { error: unknown }) => (
  <div
    data-testid="generation-error"
    className="text-3xl font-jost text-fuchsia-800 flex flex-col h-[50vh] justify-center text-center"
  >
    <h2>Ошибка генерации! Попробуйте позже.</h2>
    <p className="text-red-500 text-lg">Error: {getErrorMessage(error)}</p>
    <Link
      className="w-fit mx-auto mt-4 underline text-gray-700 font-jost hover:scale-[1.1]"
      to={"/dashboard"}
    >
      На главную
    </Link>
  </div>
);
