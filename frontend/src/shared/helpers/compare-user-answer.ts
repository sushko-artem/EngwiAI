const normalizeString = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "")
    .replace(/\s+/g, "");
};

export const compareUserAnswer = (
  userAnswer: string,
  correctAnswer: string,
): "correct" | "incorrect" => {
  return normalizeString(userAnswer) === normalizeString(correctAnswer)
    ? "correct"
    : "incorrect";
};
