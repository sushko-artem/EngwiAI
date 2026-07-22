import { describe, expect, it } from "vitest";
import { transformDataForTest } from "./transform-data";

const mockData = {
  sentences: [
    { terms: "", sentence: "Hello, World!", translation: "Привет, Мир!" },
    { terms: "", sentence: "How are you?", translation: "Как дела?" },
  ],
};

describe("transformDataForTest", () => {
  it("should extract words and join them", () => {
    const result = transformDataForTest(mockData);
    expect(result.joinedSentences).toEqual(["Hello World", "How are you"]);
  });

  it("should return translations array", () => {
    const result = transformDataForTest(mockData);
    expect(result.translations).toEqual(["Привет, Мир!", "Как дела?"]);
  });

  it("should create shuffled sentences with ids", () => {
    const result = transformDataForTest(mockData);
    expect(result.shuffledSentences).toHaveLength(2);
    expect(result.shuffledSentences[0]).toHaveLength(2);
    expect(result.shuffledSentences[0][0]).toHaveProperty("id");
    expect(result.shuffledSentences[0][0]).toHaveProperty("word");
  });
});
