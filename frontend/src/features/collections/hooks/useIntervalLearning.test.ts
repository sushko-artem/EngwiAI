import { describe, expect, it, vi } from "vitest";
import { VIRTUAL_COLLECTIONS } from "@features/collections/helpers/virtual-collection-ident-helper";
import { renderHook } from "@testing-library/react";
import { useIntervalLearning } from "./useIntervalLearning";

const inactiveCollection = {
  id: "inactive-123",
  name: "Test Collection Inactive",
  cards: [
    {
      id: "1",
      status: "INACTIVE",
      word: "word-1",
      translation: "translation-1",
    },
    {
      id: "2",
      status: "INACTIVE",
      word: "word-2",
      translation: "translation-2",
    },
  ],
};

const activeCollection = {
  id: "active-123",
  name: "Test Collection Active",
  cards: [
    {
      id: "3",
      status: "ACTIVE",
      word: "word-3",
      translation: "translation-3",
    },
    {
      id: "4",
      status: "ACTIVE",
      word: "word-4",
      translation: "translation-4",
    },
    {
      id: "5",
      status: "ACTIVE",
      word: "word-5",
      translation: "translation-5",
    },
  ],
};

const mockActiveRefetch = vi.hoisted(() => vi.fn());
const mockInactiveRefetch = vi.hoisted(() => vi.fn());

vi.mock("@features/collections/api", () => ({
  useGetCollectionQuery: vi.fn((collectionType) => {
    if (collectionType === VIRTUAL_COLLECTIONS.ACTIVE) {
      return {
        data: activeCollection,
        refetch: mockActiveRefetch,
        isLoading: false,
        isFetching: false,
      };
    } else {
      return {
        data: inactiveCollection,
        refetch: mockInactiveRefetch,
        isLoading: false,
        isFetching: false,
      };
    }
  }),
}));

describe("useIntervalLearning", () => {
  it("should call refetchQuery on mount", () => {
    renderHook(() => useIntervalLearning());
    expect(mockActiveRefetch).toHaveBeenCalled();
    expect(mockInactiveRefetch).toHaveBeenCalled();
  });

  it("should return correct length of collections", () => {
    const { result } = renderHook(() => useIntervalLearning());
    expect(result.current.activeLength).toBe(3);
    expect(result.current.inactiveLength).toBe(2);
  });
});
