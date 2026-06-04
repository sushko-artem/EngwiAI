import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useSpellCheck } from "./useSpellCheck";

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

describe("useSpellCheck", () => {
  it("should render correct data", () => {
    const { result } = renderHook(() => useSpellCheck());
    expect(result.current.collections).toMatchObject([
      { id: "1", name: "Collection 1" },
      { id: "2", name: "Collection 2" },
      { id: "3", name: "Collection 3" },
      { id: "4", name: "Collection 4" },
    ]);
  });

  it("should show warning when no modules selected", () => {
    const { result } = renderHook(() => useSpellCheck());
    act(() => {
      result.current.startTest();
    });
    expect(mockWarning).toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should navigate to dashboard when handleBack called", () => {
    const { result } = renderHook(() => useSpellCheck());
    act(() => {
      result.current.handleBack();
    });
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("should add module id when selected", () => {
    const { result } = renderHook(() => useSpellCheck());

    act(() => {
      result.current.toggleChoosenModule("1");
    });

    expect(result.current.chosenIds.has("1")).toBe(true);
  });

  it("should remove module id when already selected", () => {
    const { result } = renderHook(() => useSpellCheck());

    act(() => {
      result.current.toggleChoosenModule("1");
      result.current.toggleChoosenModule("1");
    });

    expect(result.current.chosenIds.has("1")).toBe(false);
  });

  it("should select multiple modules", () => {
    const { result } = renderHook(() => useSpellCheck());

    act(() => {
      result.current.toggleChoosenModule("1");
      result.current.toggleChoosenModule("2");
      result.current.toggleChoosenModule("3");
    });

    expect(result.current.chosenIds.size).toBe(3);
    expect(result.current.chosenIds.has("1")).toBe(true);
    expect(result.current.chosenIds.has("2")).toBe(true);
    expect(result.current.chosenIds.has("3")).toBe(true);
  });

  it("setIsVisivle should default to 'word'", () => {
    const { result } = renderHook(() => useSpellCheck());
    expect(result.current.visibleSide).toBe("word");
  });

  it("setIsVisivle should change to 'translation'", () => {
    const { result } = renderHook(() => useSpellCheck());
    act(() => {
      result.current.setVisibleSide("translation");
    });
    expect(result.current.visibleSide).toBe("translation");
  });

  it("should navigate with correct modules and visibleSide", () => {
    const { result } = renderHook(() => useSpellCheck());
    act(() => {
      result.current.toggleChoosenModule("1");
      result.current.toggleChoosenModule("2");
      result.current.setVisibleSide("translation");
    });

    act(() => {
      result.current.startTest();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/spell-check/test", {
      state: {
        modules: ["1", "2"],
        visibleSide: "translation",
      },
    });
  });
});
