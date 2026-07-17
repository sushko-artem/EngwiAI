import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useClearDraftLogic } from "./useClearDraftLogic";
import { clearCollection } from "@entities/collection/model";

const mockDispatch = vi.hoisted(() => vi.fn());
const mockRemoveItem = vi.hoisted(() => vi.fn());
const mockSetItem = vi.hoisted(() => vi.fn());
const mockLocation = {
  pathname: "",
};

vi.stubGlobal("sessionStorage", {
  removeItem: mockRemoveItem,
  setItem: mockSetItem,
});

vi.mock("@redux/hooks", () => ({
  useAppDispatch: () => mockDispatch,
}));

vi.mock("react-router-dom", () => ({
  useLocation: () => mockLocation,
}));

describe("useClearDraftLogic", () => {
  it("should clear collection when navigate from '/create-collection' route", () => {
    mockLocation.pathname = "/create-collection";
    const { rerender } = renderHook(() => useClearDraftLogic());
    expect(mockDispatch).not.toHaveBeenCalled();
    mockLocation.pathname = "/collections";
    rerender();
    expect(mockDispatch).toHaveBeenCalledWith(clearCollection());
  });

  it("should clear collection when navigate from '/edit-collection' route", () => {
    mockLocation.pathname = "/edit-collection";
    const { rerender } = renderHook(() => useClearDraftLogic());
    expect(mockDispatch).not.toHaveBeenCalled();
    mockLocation.pathname = "/collections";
    rerender();
    expect(mockDispatch).toHaveBeenCalledWith(clearCollection());
  });

  it("should remove grammar_test_cache and set grammar_test_completed into sessionStorage when navigate from '/grammar-test' route", () => {
    mockLocation.pathname = "/grammar-test";
    const { rerender } = renderHook(() => useClearDraftLogic());
    expect(mockRemoveItem).not.toHaveBeenCalled();
    mockLocation.pathname = "/grammar-check";
    rerender();
    expect(mockRemoveItem).toHaveBeenCalledWith("grammar_test_cache");
    expect(mockSetItem).toHaveBeenCalledWith("grammar_test_completed", "true");
  });
});
