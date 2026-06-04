import { describe, expect, it } from "vitest";
import { validateCollection } from "./validate-collection";

describe("validateCollection", () => {
  const validCollection = {
    name: "Unique Name",
    cards: [{ id: "1", word: "hello", translation: "привет" }],
  };

  it("should return valid for correct collectioin", () => {
    const result = validateCollection(validCollection, []);
    expect(result.isValid).toBe(true);
  });

  it("should detect empty collection", () => {
    const collection = { ...validCollection, cards: [] };

    const result = validateCollection(collection, []);

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Коллекция пустая! Добавьте карточку!");
  });

  it("should detect empty name", () => {
    const collection = { ...validCollection, name: "" };
    const result = validateCollection(collection, []);

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Все поля должны быть заполнены!");
  });

  it("should detect duplicate name", () => {
    const result = validateCollection(validCollection, ["Unique Name"]);

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe(
      "Коллекция с таким именем уже существует!",
    );
  });

  it("should detect empty card field", () => {
    const collection = {
      ...validCollection,
      cards: [{ id: "1", word: "", translation: "" }],
    };

    const result = validateCollection(collection, []);

    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Все поля должны быть заполнены!");
  });

  it("should return invalid for null collection", () => {
    const result = validateCollection(null, []);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBeUndefined();
  });
});
