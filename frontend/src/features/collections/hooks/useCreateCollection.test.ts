import { describe, expect, it, vi } from "vitest";
import {
  clearCollection,
  initDefaultCollection,
  type EditableCollectionType,
} from "@features/collections/model";
import { act, renderHook } from "@testing-library/react";
import { useCreateCollection } from "./useCreateCollection";

const defaultCollection: EditableCollectionType = {
  name: "",
  cards: [
    { id: "1", word: "", translation: "" },
    { id: "2", word: "", translation: "" },
  ],
};

const testCollection = {
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
const mockConfirm = vi.hoisted(() => vi.fn());
const mockWarning = vi.hoisted(() => vi.fn());
const mockCreateCollection = vi.hoisted(() => vi.fn());

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
}));

vi.mock("@features/collections/api", () => ({
  useGetCollectionsQuery: () => getCollectionsQueryResult,
  useCreateCollectionMutation: () => [
    mockCreateCollection,
    { isLoading: false },
  ],
}));

describe("useCreateCollection", () => {
  it("should dispatch initDefaultCollection on mount", () => {
    renderHook(() => useCreateCollection(defaultCollection));

    expect(mockDispatch).toHaveBeenCalledWith(initDefaultCollection());
  });

  it("should dispatch clearCollection on unmount", () => {
    const { unmount } = renderHook(() => useCreateCollection(null));
    unmount();
    expect(mockDispatch).toHaveBeenCalledWith(clearCollection());
  });

  it("should save collection when isValid", async () => {
    mockCreateCollection.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({}),
    });

    const { result } = renderHook(() => useCreateCollection(testCollection));

    await act(async () => {
      await result.current.saveCollection();
    });

    expect(mockCreateCollection).toHaveBeenCalledWith({
      name: "Test Collection",
      cards: [
        { id: "1", word: "hello", translation: "привет" },
        { id: "2", word: "world", translation: "мир" },
      ],
    });

    expect(mockNavigate).toHaveBeenCalledWith("/collections", {
      replace: true,
      state: { refetch: true },
    });
  });

  it("should prevent saving invalid collection (empty name)", async () => {
    const invalidCollection = {
      name: "",
      cards: [
        { id: "1", word: "hello", translation: "привет" },
        { id: "2", word: "world", translation: "мир" },
      ],
    };

    const { result } = renderHook(() => useCreateCollection(invalidCollection));

    await act(async () => {
      await result.current.saveCollection();
    });

    expect(mockWarning).toHaveBeenCalledWith("Все поля должны быть заполнены!");
    expect(mockCreateCollection).not.toHaveBeenCalled();
  });

  it("should prevent saving invalid collection (existing name)", async () => {
    const invalidCollection = {
      name: "firstCollection",
      cards: [
        { id: "1", word: "hello", translation: "привет" },
        { id: "2", word: "world", translation: "мир" },
      ],
    };

    const { result } = renderHook(() => useCreateCollection(invalidCollection));

    await act(async () => {
      await result.current.saveCollection();
    });

    expect(mockWarning).toHaveBeenCalledWith(
      "Коллекция с таким именем уже существует!",
    );
    expect(mockCreateCollection).not.toHaveBeenCalled();
  });

  it("should prevent saving invalid collection (empty cards)", async () => {
    const invalidCollection = {
      name: "emptyCollection",
      cards: [],
    };

    const { result } = renderHook(() => useCreateCollection(invalidCollection));

    await act(async () => {
      await result.current.saveCollection();
    });

    expect(mockWarning).toHaveBeenCalledWith(
      "Коллекция пустая! Добавьте карточку!",
    );
    expect(mockCreateCollection).not.toHaveBeenCalled();
  });

  it("should show modal with error when saveCollection rejected", async () => {
    mockCreateCollection.mockReturnValue({
      unwrap: vi.fn().mockRejectedValue(new Error("Network error!")),
    });

    const { result } = renderHook(() => useCreateCollection(testCollection));

    await act(async () => {
      await result.current.saveCollection();
    });
    expect(mockCreateCollection).toHaveBeenCalled();
    expect(mockWarning).toHaveBeenCalledWith("Network error!");
  });

  it("should show modal with confirm message when back and unsaved changes", async () => {
    mockConfirm.mockResolvedValue(true);

    const { result } = renderHook(() => useCreateCollection(testCollection));

    await act(async () => {
      await result.current.back();
    });

    expect(mockConfirm).toHaveBeenCalledWith(
      "Все несохраненные данные будут потеряны!",
    );

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("should navigate to '/dashboard' when no changes", async () => {
    const { result } = renderHook(() => useCreateCollection(defaultCollection));

    await act(async () => {
      await result.current.back();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
