import { describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useCollections } from "./useCollections";

const mockNavigate = vi.fn();
const mockRefetch = vi.fn();
const mockConfirm = vi.fn();
const mockDelete = vi.fn();
const mockLocationState = { refetch: false };

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(() => mockNavigate),
  useLocation: vi.fn(() => ({
    pathname: "/collections",
    state: mockLocationState,
  })),
}));

vi.mock("@widgets/modal", () => ({
  useModal: vi.fn(() => ({
    warning: vi.fn(),
    confirm: mockConfirm,
  })),
}));

vi.mock("@features/collections/api", () => ({
  useGetCollectionsQuery: vi.fn(() => ({
    data: [
      { id: "1", name: "Collection 1" },
      { id: "2", name: "Collection 2" },
    ],
    isLoading: false,
    error: null,
    refetch: mockRefetch,
  })),
  useDeleteCollectionMutation: vi.fn(() => [mockDelete, { isLoading: false }]),
}));

describe("useCollections", () => {
  it("collections should have correct data", () => {
    const { result } = renderHook(() => useCollections());

    expect(result.current.collections).toMatchObject([
      { id: "1", name: "Collection 1" },
      { id: "2", name: "Collection 2" },
    ]);
  });

  it("should refetch if refetchFlag", async () => {
    mockLocationState.refetch = true;
    mockRefetch.mockResolvedValue(undefined);

    renderHook(() => useCollections());

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/collections", {
        replace: true,
        state: {},
      });
    });
  });

  it("should delete collection when confirmed", async () => {
    mockConfirm.mockResolvedValue(true);
    mockDelete.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({}),
    });
    const { result } = renderHook(() => useCollections());

    await act(async () => {
      await result.current.onDelete("1");
    });

    expect(mockConfirm).toHaveBeenCalledWith("Удалить коллекцию Collection 1?");
    expect(mockDelete).toHaveBeenCalledWith("1");
  });

  it("should redirect to '/dashboard' when back", () => {
    const { result } = renderHook(() => useCollections());

    act(() => {
      result.current.back();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
