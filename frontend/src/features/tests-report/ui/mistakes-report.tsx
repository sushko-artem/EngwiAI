type MistakesReportPropType = {
  report: Record<string, string>;
};

export const MistakesReport = ({ report }: MistakesReportPropType) => {
  return (
    <div className="flex justify-center mt-6 font-jost md:text-xl">
      <table>
        <caption className="text-red-700 font-comic">Анализ ошибок</caption>
        <thead>
          <tr className="text-fuchsia-900 font-roboto">
            <th>Ваш ответ</th>
            <th>Правильный ответ</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(report).map(([key, value], index) => (
            <tr className="text-center font-roboto" key={index}>
              <td>{!value ? "--" : value}</td>
              <td className="text-green-900">{key}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
