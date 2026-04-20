import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
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
const mockUseBlocker = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useBlocker: mockUseBlocker,
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

const mockSelectorState = (
  editableCollection: EditableCollectionType | undefined,
  deletedCards: string[] = [],
) => {
  mockSelector.mockReturnValue({
    editableCollection,
    deletedCards,
  });
};

describe("useEditCollection", () => {
  beforeEach(() => {
    mockUseBlocker.mockReturnValue({
      state: "unblocked",
      proceed: vi.fn(),
      reset: vi.fn(),
    });
    mockSelectorState(testCollection, []);
  });

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

  it("should navigate to '/collections' without saving when no changes", async () => {
    const { result } = renderHook(() => useEditCollection("test-id-1234"));

    await act(async () => {
      await result.current.saveCollection();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/collections");
    expect(mockUpdateCollection).not.toHaveBeenCalled();
  });

  it("should prevent saving with duplicate name", async () => {
    const mockEditedCollection = { ...testCollection, name: "firstCollection" };
    mockSelectorState(mockEditedCollection, []);

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

    mockSelectorState(mockEditedCollection, []);

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

    mockSelectorState(mockUpdatedCollection, ["2"]);

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

  it("should show warning modal with generic errors when updating rejected", async () => {
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

    mockSelectorState(mockEditedCollection, []);

    const { result } = renderHook(() => useEditCollection("test-id-1234"));

    await act(async () => {
      await result.current.saveCollection();
    });

    expect(mockWarning).toHaveBeenCalledWith("Network error!");
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should reset isSaving flag when update fails", async () => {
    const mockEditedCollection = {
      name: "Test Collection",
      cards: [
        { id: "1", word: "hello", translation: "привет", isUpdated: true },
      ],
    };
    mockSelectorState(mockEditedCollection, []);

    const { result } = renderHook(() => useEditCollection("test-id-1234"));

    await act(async () => {
      await result.current.saveCollection();
    });
    expect(mockWarning).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
