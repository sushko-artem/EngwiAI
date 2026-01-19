import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAppDispatch } from "@redux/hooks";
import { addCard, updateCollectionName } from "@features/collections/model";
import { renderHook } from "@testing-library/react";
import { useEdit } from "./useEdit";

vi.mock("@redux/hooks");
vi.mock("@features/collections/model");

describe("useEdit", () => {
  const mockDispatch = vi.fn();
  const div = document.createElement("div");
  div.scrollIntoView = vi.fn();
  const mockScrollRef = { current: div };

  beforeEach(() => {
    vi.mocked(useAppDispatch).mockReturnValue(mockDispatch);
  });

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
