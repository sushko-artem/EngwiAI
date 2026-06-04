import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EditableCollection } from "./editable-collection";

vi.mock("../lib/hooks/useEdit", () => ({
  useEdit: vi.fn(() => ({
    handleNameChange: vi.fn(),
    handleAddCard: vi.fn(),
  })),
}));

vi.mock("@entities/collection/ui", () => ({
  CollectionName: vi.fn(() => <div>CollectionName</div>),
  CardsList: vi.fn(() => <div>CardsList</div>),
  AddCardButton: vi.fn(() => <button>AddCardButton</button>),
}));

describe("EditableCollection", () => {
  it("shoul pass correct props to child components", async () => {
    const { CollectionName, CardsList, AddCardButton } =
      await import("@entities/collection/ui");

    const mockCollection = [{ id: "1", word: "hello", translation: "привет" }];

    render(<EditableCollection name="Test" collection={mockCollection} />);

    expect(vi.mocked(CollectionName)).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Test",
        onChange: expect.any(Function),
      }),
      undefined,
    );

    expect(vi.mocked(CardsList)).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: mockCollection,
      }),
      undefined,
    );

    expect(vi.mocked(AddCardButton)).toHaveBeenCalledWith(
      expect.objectContaining({
        onAdd: expect.any(Function),
      }),
      undefined,
    );
  });

  it("should pass scrollRef to useEdit hook", async () => {
    const { useEdit } = await import("../lib/hooks/useEdit");

    render(<EditableCollection name="Test" collection={[]} />);

    expect(vi.mocked(useEdit)).toHaveBeenCalledWith(
      expect.objectContaining({
        current: expect.anything(),
      }),
    );
  });
});
