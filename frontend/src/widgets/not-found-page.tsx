import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <section className="flex flex-col text-center font-roboto text-2xl text-fuchsia-800 mt-10">
      <h1>Страница не найдена!</h1>
      <Link
        className="w-fit mx-auto mt-4 underline text-gray-700 font-jost hover:scale-[1.1]"
        to={"/dashboard"}
      >
        На главную
      </Link>
    </section>
  );
};
