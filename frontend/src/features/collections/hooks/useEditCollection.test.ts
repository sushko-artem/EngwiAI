import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
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

  it("should update collection and navigate to '/collections'", async () => {
    mockGetCollectionQuery.mockReturnValue({
      data: testCollection,
      error: null,
    });

    mockUpdateCollection.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({}),
    });

    const mockUpdatedCollection = {
      name: "Updated Collection",
      cards: [
        { id: "1", word: "Hello", translation: "привет", isUpdated: true },
        { id: "3", word: "fish", translation: "рыба", isNew: true },
      ],
    };

    mockSelector
      .mockReturnValueOnce(mockUpdatedCollection)
      .mockReturnValueOnce(["2"]);

    const { result } = renderHook(() => useEditCollection("test-id-1234"));

    await act(async () => {
      await result.current.saveCollection();
    });

    expect(mockUpdateCollection).toHaveBeenCalledWith({
      id: "test-id-1234",
      dto: {
        newName: "Updated Collection",
        updatedCards: [
          { id: "1", word: "Hello", translation: "привет", isUpdated: true },
        ],
        newCards: [{ id: "3", word: "fish", translation: "рыба", isNew: true }],
        deletedCards: ["2"],
      },
    });

    expect(mockNavigate).toHaveBeenCalledWith("/collections", {
      replace: true,
      state: { refetch: true },
    });
  });

  it("should show worning modal with generic errors when updating rejected", async () => {
    const mockEditedCollection = {
      name: "Test Collection",
      cards: [
        { id: "1", word: "hello", translation: "привет", isUpdated: true },
        { id: "2", word: "world", translation: "мир" },
      ],
    };

    mockUpdateCollection.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue(new Error("Network error!")),
    });

    mockSelector
      .mockReturnValueOnce(mockEditedCollection)
      .mockReturnValueOnce([]);

    const { result } = renderHook(() => useEditCollection("test-id-1234"));

    await act(async () => {
      await result.current.saveCollection();
    });

    expect(mockWarning).toHaveBeenCalledWith("Network error!");
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should navigate to '/collections' when back and no changes", async () => {
    mockSelector.mockReturnValueOnce(testCollection).mockReturnValueOnce([]);

    const { result } = renderHook(() => useEditCollection("test-id-1234"));

    await act(async () => {
      await result.current.back();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/collections");
  });

  it("should show modal with confirm message when back and unsaved changes", async () => {
    mockGetCollectionQuery.mockReturnValue({
      data: testCollection,
      error: null,
    });

    const mockUpdatedCollection = {
      name: "Test Collection",
      cards: [
        { id: "1", word: "Hello", translation: "привет", isUpdated: true },
        { id: "3", word: "fish", translation: "рыба", isNew: true },
      ],
    };

    mockSelector
      .mockReturnValueOnce(mockUpdatedCollection)
      .mockReturnValueOnce(["2"]);

    mockConfirm.mockResolvedValue(true);

    const { result } = renderHook(() => useEditCollection("test-id-1234"));

    await act(async () => {
      await result.current.back();
    });

    expect(mockConfirm).toHaveBeenCalledWith(
      "Вы действительно хотите покинуть страницу? Внесенные изменения сохранены не будут!",
    );

    expect(mockNavigate).toHaveBeenCalledWith("/collections");
  });
});
