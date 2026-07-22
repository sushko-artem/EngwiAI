import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useGrammarCheck } from "..";
import { act } from "react";

const mockNavigate = vi.hoisted(() => vi.fn());
const mockWarning = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@widgets/modal", () => ({
  useModal: () => ({
    warning: mockWarning,
  }),
}));

vi.mock("@entities/collection/api", () => ({
  useGetCollectionsQuery: vi.fn(() => ({
    data: [
      { id: "1", name: "Collection 1" },
      { id: "2", name: "Collection 2" },
      { id: "3", name: "Collection 3" },
      { id: "4", name: "Collection 4" },
    ],
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  })),
}));

describe("useGrammarCheck", () => {
  it("should render correct data", () => {
    const { result } = renderHook(() => useGrammarCheck());
    expect(result.current.collections).toMatchObject([
      { id: "1", name: "Collection 1" },
      { id: "2", name: "Collection 2" },
      { id: "3", name: "Collection 3" },
      { id: "4", name: "Collection 4" },
    ]);
  });

  it("should set choosen collection id when selected", () => {
    const { result } = renderHook(() => useGrammarCheck());
    act(() => {
      result.current.setChosenId("3");
    });
    expect(result.current.chosenId).toBe("3");
    act(() => {
      result.current.setChosenId("1");
    });
    expect(result.current.chosenId).not.toBe("3");
    expect(result.current.chosenId).toBe("1");
  });

  it("should set visible side", () => {
    const { result } = renderHook(() => useGrammarCheck());
    expect(result.current.cardSide).toBe("word");
    act(() => {
      result.current.setCardSide("translation");
    });
    expect(result.current.cardSide).toBe("translation");
  });

  it("should set count of generated sentences", () => {
    const { result } = renderHook(() => useGrammarCheck());
    expect(result.current.count).toBe("5");
    act(() => {
      result.current.setCount("7");
    });
    expect(result.current.count).toBe("7");
  });

  it("should set difficulty", () => {
    const { result } = renderHook(() => useGrammarCheck());
    expect(result.current.difficulty).toBe("beginner");
    act(() => {
      result.current.setDifficulty("advanced");
    });
    expect(result.current.difficulty).toBe("advanced");
  });

  it("should show modal warning when no collections selected", () => {
    const { result } = renderHook(() => useGrammarCheck());
    expect(result.current.chosenId).toBe("");
    act(() => {
      result.current.startTest();
    });
    expect(mockWarning).toHaveBeenCalledWith("Ни одного модуля не выбрано!");
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should navigate with correct state", () => {
    const { result } = renderHook(() => useGrammarCheck());
    act(() => {
      result.current.setChosenId("3");
      result.current.setCardSide("translation");
      result.current.setDifficulty("advanced");
      result.current.setCount("10");
    });
    act(() => {
      result.current.startTest();
    });
    expect(mockNavigate).toHaveBeenCalledWith("/grammar-test", {
      state: {
        chosenId: "3",
        cardSide: "translation",
        difficulty: "advanced",
        numberCount: 10,
      },
    });
  });
});
