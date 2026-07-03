import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { usePreventReload } from "./usePreventReload";

describe("usePreventReload", () => {
  it("should add beforeunload listener when shouldPrevent is true", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    renderHook(() => usePreventReload(true));
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function),
    );
    expect(removeEventListenerSpy).not.toHaveBeenCalled();
  });

  it("should NOT add beforeunload listener when shouldPrevent is false", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    renderHook(() => usePreventReload(false));

    expect(addEventListenerSpy).not.toHaveBeenCalled();
  });

  it("should remove listener when shouldPrevent changes from true to false", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { rerender } = renderHook(
      ({ shouldPrevent }) => usePreventReload(shouldPrevent),
      { initialProps: { shouldPrevent: true } },
    );
    expect(removeEventListenerSpy).not.toHaveBeenCalled();
    rerender({ shouldPrevent: false });
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function),
    );
  });

  it("should remove listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => usePreventReload(true));
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function),
    );
  });

  it("should call preventReload on beforeunload event", () => {
    let capturedHandler: ((e: BeforeUnloadEvent) => void) | null = null;

    vi.spyOn(window, "addEventListener").mockImplementation(
      (event, handler) => {
        if (event === "beforeunload") {
          capturedHandler = handler as (e: BeforeUnloadEvent) => void;
        }
      },
    );

    renderHook(() => usePreventReload(true));
    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as BeforeUnloadEvent;

    capturedHandler!(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });
});
