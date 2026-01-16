import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useAnimation } from "./useAnimation";
import { useNavigate } from "react-router-dom";
import { useGetMeQuery } from "@features/auth";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("@features/auth", () => ({
  useGetMeQuery: vi.fn(),
}));

describe("useAnimation", () => {
  let mockNavigate: Mock;
  beforeEach(() => {
    mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    Object.defineProperty(window, "sessionStorage", {
      value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
      },
      writable: true,
    });

    vi.mocked(useGetMeQuery).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: undefined,
      refetch: vi.fn(),
    });
  });

  it("should init with isAnimated=false", () => {
    const { result } = renderHook(() => useAnimation());
    expect(window.sessionStorage.getItem).toHaveBeenCalledWith(
      "isAnimationCompleted"
    );
    expect(result.current.isAnimated).toBe(false);
  });

  it("should set isAnimated=true & navigate to '/sign-in' when user is not exist", () => {
    const { result } = renderHook(() => useAnimation());
    act(() => result.current.completeAnimation());
    expect(result.current.isAnimated).toBe(true);
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
      "isAnimationCompleted",
      "true"
    );
    expect(mockNavigate).toHaveBeenCalledWith("/sign-in", { replace: true });
  });

  it("should navigate to '/sign-in' when isAnimated=true & user is not exist", () => {
    window.sessionStorage.getItem = vi.fn(() => "true");
    const { result } = renderHook(() => useAnimation());
    expect(result.current.isAnimated).toBe(true);
    expect(mockNavigate).toHaveBeenCalledWith("/sign-in", { replace: true });
  });

  it("should navigate to '/dashboard' when isAnimated=true & user exists", () => {
    window.sessionStorage.getItem = vi.fn(() => "true");
    vi.mocked(useGetMeQuery).mockReturnValue({
      data: { id: 1, name: "User" },
      isLoading: false,
      refetch: vi.fn(),
    });
    const { result } = renderHook(() => useAnimation());
    expect(result.current.isAnimated).toBe(true);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { replace: true });
  });
});
