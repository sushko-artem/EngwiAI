import { describe, expect, it } from "vitest";
import { compareUserAnswer } from "./compare-user-answer";

describe("compare-user-answer", () => {
  it.each([
    ["hello", "hello", "correct"],
    ["Hello", "hello", "correct"],
    ["  hello  ", "hello", "correct"],
    ["hello, world!", "helloworld", "correct"],
    ["hello@#$%", "hello", "correct"],
    ["привет", "Привет", "correct"],
    ["hello\nworld", "helloworld", "correct"],
    ["hello123", "hello123", "correct"],
    ["abc", "xyz", "incorrect"],
    ["hello", "hell", "incorrect"],
    ["helloo", "hello", "incorrect"],
    ["holle", "hello", "incorrect"],
    ["test123", "test124", "incorrect"],
    ["", "", "correct"],
    ["   ", "", "correct"],
    ["!@#$%", "", "correct"],
  ])(
    'compairing "%s" with "%s" should return "%s"',
    (userAnswer, correctAnswer, expected) => {
      expect(compareUserAnswer(userAnswer, correctAnswer)).toBe(expected);
    },
  );
});
