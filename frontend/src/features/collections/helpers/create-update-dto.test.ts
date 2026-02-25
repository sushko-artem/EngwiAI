import { describe, expect, it } from "vitest";
import { createUpdateDto } from "./create-update-dto";

describe("createUpdateDto", () => {
  const editedCollection = {
    name: " New Collection ",
    cards: [
      { id: "1", word: "hello ", translation: " привет ", isUpdated: true },
      { id: "2", word: "world", translation: "мир" },
      { id: "3", word: " new ", translation: " новый ", isNew: true },
    ],
  };

  it("should update dto with trimmed fields", () => {
    const dto = createUpdateDto("Old Collection", editedCollection, []);

    expect(dto.newName).toBe("New Collection");
    expect(dto.newCards).toEqual([
      {
        id: "3",
        word: "new",
        translation: "новый",
        isNew: true,
      },
    ]);
    expect(dto.updatedCards).toEqual([
      { id: "1", word: "hello", translation: "привет", isUpdated: true },
    ]);
  });

  it("should include deleted cards", () => {
    const dto = createUpdateDto("Name", editedCollection, ["4", "5"]);

    expect(dto.deletedCards).toEqual(["4", "5"]);
  });

  it("should not include data if unchanged", () => {
    const unchangedCollection = {
      name: "Collection",
      cards: [{ id: "1", word: "word", translation: "слово" }],
    };
    const dto = createUpdateDto("Collection", unchangedCollection, []);

    expect(Object.keys(dto)).toHaveLength(0);
  });
});
