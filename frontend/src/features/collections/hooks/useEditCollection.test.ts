import { describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import {
  clearCollection,
  setExistedCollection,
  type EditableCollectionType,
} from "@features/collections/model";
import { useEditCollection } from "./useEditCollection";

const testCollection: EditableCollectionType = {
  name: "Test Collection",
  cards: [
    { id: "1", word: "hello", translation: "привет" },
    { id: "2", word: "world", translation: "мир" },
  ],
};

const getCollectionsQueryResult = {
  data: [
    {
      id: "1",
      name: "firstCollection",
    },
    {
      id: "2",
      name: "secondCollection",
    },
  ],
};

const mockNavigate = vi.hoisted(() => vi.fn());
const mockDispatch = vi.hoisted(() => vi.fn());
const mockSelector = vi.hoisted(() => vi.fn());
const mockConfirm = vi.hoisted(() => vi.fn());
const mockWarning = vi.hoisted(() => vi.fn());
const mockUpdateCollection = vi.hoisted(() => vi.fn());
const mockGetCollectionQuery = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@widgets/modal", () => ({
  useModal: () => ({
    warning: mockWarning,
    confirm: mockConfirm,
  }),
}));

vi.mock("@redux/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: mockSelector,
}));

vi.mock("@features/collections/api", () => ({
  useGetCollectionQuery: mockGetCollectionQuery,
  useGetCollectionsQuery: () => getCollectionsQueryResult,
  useUpdateCollectionMutation: () => [
    mockUpdateCollection,
    { isLoading: false },
  ],
}));

describe("useEditCollection", () => {
  it("should call useGetCollectionQuery with right id", async () => {
    mockGetCollectionQuery.mockReturnValue({
      data: testCollection,
      error: null,
    });
    renderHook(() => useEditCollection("test-id-1234"));
    expect(mockGetCollectionQuery).toHaveBeenCalledWith("test-id-1234");
  });

  it("should store Redux state with loaded collection on mount", () => {
    renderHook(() => useEditCollection("test-id-1234"));

    expect(mockDispatch).toHaveBeenCalledWith(
      setExistedCollection(testCollection),
    );
  });

  it("should clear Redux state on unmount", () => {
    const { unmount } = renderHook(() => useEditCollection("test-id-1234"));

    unmount();

    expect(mockDispatch).toHaveBeenCalledWith(clearCollection());
  });

  it("should navigate to '/collections' without saving when no changes", async () => {
    mockSelector.mockReturnValueOnce(testCollection).mockReturnValueOnce([]);
    const { result } = renderHook(() => useEditCollection("test-id-1234"));

    await act(async () => {
      await result.current.saveCollection();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/collections");
    expect(mockUpdateCollection).not.toHaveBeenCalled();
  });

  it("should prevent saving with duplicate name", async () => {
    const mockEditedCollection = { ...testCollection, name: "firstCollection" };

    mockSelector
      .mockReturnValueOnce(mockEditedCollection)
      .mockReturnValueOnce([]);

    const { result } = renderHook(() => useEditCollection("test-id-1234"));

    await act(async () => {
      await result.current.saveCollection();
    });

    expect(mockWarning).toHaveBeenCalledWith(
      "Коллекция с таким именем уже существует!",
    );
    expect(mockUpdateCollection).not.toHaveBeenCalled();
  });

  it("should prevent saving with empty fields (card or name)", async () => {
    const mockEditedCollection = {
      name: "Test Collection",
      cards: [
        { id: "1", word: "", translation: "привет", isUpdated: true },
        { id: "2", word: "world", translation: "мир" },
      ],
    };

    mockSelector
      .mockReturnValueOnce(mockEditedCollection)
      .mockReturnValueOnce([]);

    const { result } = renderHook(() => useEditCollection("test-id-1234"));

    await act(async () => {
      await result.current.saveCollection();
    });

    expect(mockWarning).toHaveBeenCalledWith("Все поля должны быть заполнены!");
    expect(mockUpdateCollection).not.toHaveBeenCalled();
  });
});
