import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
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
const mockConfirm = vi.hoisted(() => vi.fn());
const mockDeleteCollection = vi.hoisted(() => vi.fn());
const mockGetCollectionQuery = vi.hoisted(() => vi.fn());
const mockUpdateCollection = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
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
  });
  it("should call useGetCollectionQuery with correct id", () => {
    renderHook(() => useFlashCards("test-id-123"));

    expect(mockGetCollectionQuery).toHaveBeenCalledWith("test-id-123");
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

  it("should navigate to '/collections' when back", () => {
    const { result } = renderHook(() => useFlashCards("test-id-123"));

    act(() => {
      result.current.back();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/collections");
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
});
