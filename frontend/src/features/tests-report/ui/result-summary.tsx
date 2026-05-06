type ResultSummaryPropType = {
  totalTerms: number;
  progress: number;
  totalMistakes: number;
};

export const ResultSummary = ({
  totalTerms,
  progress,
  totalMistakes,
}: ResultSummaryPropType) => {
  return (
    <div className="flex justify-center mt-6 font-jost md:text-xl">
      <table className="border-separate">
        <tbody>
          <tr>
            <td className="text-fuchsia-900">Всего задач в тесте</td>
            <td className="font-bold text-green-700 text-center">
              {totalTerms}
            </td>
          </tr>
          <tr>
            <td className="text-fuchsia-900">Процент правильных ответов</td>
            <td className="font-bold text-blue-700 text-center">{progress}%</td>
          </tr>
          <tr>
            <td className="text-fuchsia-900">Совершено ошибок</td>
            <td className="font-bold text-red-700 text-center">
              {totalMistakes}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
