import { describe, expect, it, vi } from "vitest";
import { addCard, updateCollectionName } from "@features/collections/model";
import { renderHook } from "@testing-library/react";
import { useEdit } from "./useEdit";

const mockDispatch = vi.hoisted(() => vi.fn());

vi.mock("@redux/hooks", () => ({
  useAppDispatch: () => mockDispatch,
}));
vi.mock("@features/collections/model");

describe("useEdit", () => {
  const div = document.createElement("div");
  div.scrollIntoView = vi.fn();
  const mockScrollRef = { current: div };

  it("should dispatch updateCollectionName", () => {
    const { result } = renderHook(() => useEdit(mockScrollRef));

    result.current.handleNameChange("New collection");

    expect(mockDispatch).toHaveBeenCalledWith(
      updateCollectionName("New collection"),
    );
  });

  it("should dispatch addCard and scroll", () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useEdit(mockScrollRef));

    result.current.handleAddCard();

    expect(mockDispatch).toHaveBeenCalledWith(addCard());

    vi.runAllTimers();

    expect(mockScrollRef.current.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "nearest",
    });
    vi.useRealTimers();
  });
});
