import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useFlashCards } from "./useFlashCards";
import type { ICollectionCardsResponse } from "@shared/api";

const testCollection: ICollectionCardsResponse | undefined = {
  id: "1",
  name: "Test Collection",
  cards: [
    { id: "1", word: "hello", translation: "привет" },
    { id: "2", word: "world", translation: "мир" },
  ],
};

const mockNavigate = vi.hoisted(() => vi.fn());
const mockBlocker = vi.hoisted(() => vi.fn());
const mockConfirm = vi.hoisted(() => vi.fn());
const mockDeleteCollection = vi.hoisted(() => vi.fn());
const mockGetCollectionQuery = vi.hoisted(() => vi.fn());
const mockUpdateCollection = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useBlocker: mockBlocker,
}));

vi.mock("@widgets/modal", () => ({
  useModal: () => ({
    confirm: mockConfirm,
  }),
}));

vi.mock("@features/collections/api", () => ({
  useDeleteCollectionMutation: () => [mockDeleteCollection],
  useGetCollectionQuery: mockGetCollectionQuery,
  useUpdateCollectionMutation: () => [mockUpdateCollection],
}));

describe("useFlashCards", () => {
  beforeEach(() => {
    mockGetCollectionQuery.mockReturnValue({
      data: testCollection,
      isLoading: false,
      error: null,
    });

    mockBlocker.mockReturnValue({
      state: "unblocked",
      proceed: vi.fn(),
      reset: vi.fn(),
    });
  });
  it("should call useGetCollectionQuery with correct id", () => {
    renderHook(() => useFlashCards("test-id-123"));

    expect(mockGetCollectionQuery).toHaveBeenCalledWith("test-id-123");
  });

  it("should set isVirtual=true if collectionId is 'active' or 'inactive' ", () => {
    const { result } = renderHook(() => useFlashCards("inactive"));
    expect(result.current.isVirtual).toBe(true);
  });

  it("should shuffle cards order", () => {
    const mockCollection = {
      id: "test-123",
      name: "Test Collection",
      cards: [
        { id: "1", word: "Word 1", translation: "Translation 1" },
        { id: "2", word: "Word 2", translation: "Translation 2" },
        { id: "3", word: "Word 3", translation: "Translation 3" },
        { id: "4", word: "Word 4", translation: "Translation 4" },
        { id: "5", word: "Word 5", translation: "Translation 5" },
        { id: "6", word: "Word 6", translation: "Translation 6" },
        { id: "7", word: "Word 7", translation: "Translation 7" },
        { id: "8", word: "Word 8", translation: "Translation 8" },
        { id: "9", word: "Word 9", translation: "Translation 9" },
        { id: "10", word: "Word 10", translation: "Translation 10" },
        { id: "11", word: "Word 11", translation: "Translation 11" },
        { id: "12", word: "Word 12", translation: "Translation 12" },
        { id: "13", word: "Word 13", translation: "Translation 13" },
      ],
    };
    mockGetCollectionQuery.mockReturnValue({
      data: mockCollection,
      isLoading: false,
      error: null,
    });
    const { result } = renderHook(() => useFlashCards("test-123"));

    const originalOrder = mockCollection.cards.map((card) => card.id);
    const shuffledOrder = result.current.collection?.cards.map(
      (card) => card.id,
    ) as string[];

    expect(originalOrder).not.toEqual(shuffledOrder);
    expect(originalOrder).toEqual(expect.arrayContaining(shuffledOrder));
    expect(originalOrder.sort()).toEqual(shuffledOrder.sort());
  });

  it("should return error when collection not found", () => {
    mockGetCollectionQuery.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
      error: new Error("Collection not found!"),
    });

    const { result } = renderHook(() => useFlashCards("test-id-123"));

    expect(result.current.error).toBeInstanceOf(Error);

    expect(result.current.error).toMatchObject({
      message: "Collection not found!",
    });
  });

  it("should increase unmemTerms when status is false", () => {
    const { result } = renderHook(() => useFlashCards("test-id-123"));

    act(() => {
      result.current.handleChosenStatus(false);
    });

    expect(result.current.unmemTerms).toBe(1);
  });

  it("should show next card when status is true", () => {
    const { result } = renderHook(() => useFlashCards("test-id-123"));

    act(() => {
      result.current.handleChosenStatus(true);
    });

    expect(result.current.unmemTerms).toBe(0);
    expect(result.current.index).toBe(1);
  });

  it("should show modal on last card", () => {
    const { result } = renderHook(() => useFlashCards("test-id-123"));

    act(() => {
      result.current.handleChosenStatus(true);
    });

    expect(result.current.isModalOpen).toBe(false);

    act(() => {
      result.current.handleChosenStatus(true);
    });

    expect(result.current.isModalOpen).toBe(true);
  });

  it("should toggle isReversed when handleSwitchChange", () => {
    const { result } = renderHook(() => useFlashCards("test-id-123"));

    expect(result.current.isReversed).toBe(false);

    act(() => {
      result.current.handleSwitchChange();
    });

    expect(result.current.isReversed).toBe(true);
  });

  it("should open/close menu with options()", () => {
    const { result } = renderHook(() => useFlashCards("test-id-123"));

    act(() => {
      result.current.options();
    });

    expect(result.current.isMenuOpen).toBe(true);

    act(() => {
      result.current.options();
    });

    expect(result.current.isMenuOpen).toBe(false);
  });

  it("should delete collection when confirmed", async () => {
    mockConfirm.mockResolvedValue(true);

    mockDeleteCollection.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({}),
    });

    const { result } = renderHook(() => useFlashCards("test-id-123"));

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(result.current.isMenuOpen).toBe(false);
    expect(mockConfirm).toHaveBeenCalledWith(
      'Удалить коллекцию "Test Collection"?',
    );
    expect(mockDeleteCollection).toHaveBeenCalledWith("test-id-123");
    expect(mockNavigate).toHaveBeenCalledWith("/collections");
  });

  it("should NOT delete collection when cancelled", async () => {
    mockConfirm.mockResolvedValue(false);

    const { result } = renderHook(() => useFlashCards("test-id-123"));

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(result.current.isMenuOpen).toBe(false);
    expect(mockConfirm).toHaveBeenCalled();
    expect(mockDeleteCollection).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should block browser back button when test in progress", async () => {
    const mockProceed = vi.fn();
    const mockReset = vi.fn();
    const { result, rerender } = renderHook(() => useFlashCards("test-id-123"));
    mockConfirm.mockResolvedValue(true);
    act(() => {
      result.current.handleChosenStatus(true);
    });

    mockBlocker.mockReturnValue({
      state: "blocked",
      proceed: mockProceed,
      reset: mockReset,
    });

    rerender();

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledWith(
        "Модуль не завершен! Результат не сохранится!",
      );
    });
    expect(mockProceed).toHaveBeenCalled();
  });
});
