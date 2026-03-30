export const IntervalDescription = () => (
  <section className="max-w-[80%] text-center mt-2 mb-2 font-roboto text-fuchsia-800 text-xs md:text-sm md:max-w-[40%] m-auto">
    <div>*Карточки всех модулей распределены на&nbsp;две&nbsp;категории.</div>
    <p>
      В <span className="text-green-600"> зеленом</span> блоке находятся
      карточки, которые, в процессе работы с флэш-картами, были Вами определены
      в&nbsp;категорию&nbsp;
      <span className="text-green-600 font-bold">"Знаю!"</span> <br /> В{" "}
      <span className="text-red-600">красном</span> блоке -
      в&nbsp;категорию&nbsp;
      <span className="text-red-600 font-bold">"Изучено"</span> <br />
      После прохождения "Контрольного тестирования", статус карточек будет
      изменен, согласно Вашему&nbsp;выбору.
    </p>
  </section>
);
