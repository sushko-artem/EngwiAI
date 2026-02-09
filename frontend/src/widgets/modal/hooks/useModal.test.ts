import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useModal } from "./useModal";

const mockDispatch = vi.hoisted(() => vi.fn());

vi.mock("@redux/hooks", () => ({
  useAppDispatch: () => mockDispatch,
}));

describe("useModal", () => {
  it("should call dispatch with warning action and correct payload", () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.warning("Warning message!");
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);

    const [action] = mockDispatch.mock.calls[0];

    expect(action.type).toBe("modal/openModal");
    expect(action.payload).toEqual({
      mode: "WARN",
      message: "Warning message!",
    });
  });

  it("should call dispatch with confirm action and correct payload", () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.confirm("Confirm message");
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);

    const [action] = mockDispatch.mock.calls[0];

    expect(action.type).toBe("modal/openModalWithPromise");
    expect(action.payload).toEqual({
      mode: "CONFIRM",
      message: "Confirm message",
    });
  });
});
