import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useNavigationGuard } from "./useNavigationGuard";

const mockBlocker = vi.hoisted(() => vi.fn());
const mockConfirm = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", () => ({
  useBlocker: mockBlocker,
}));

vi.mock("@widgets/modal", () => ({
  useModal: () => ({
    confirm: mockConfirm,
  }),
}));

describe("useNavigationGuard", () => {
  let mockProceed: ReturnType<typeof vi.fn>;
  let mockReset: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockProceed = vi.fn();
    mockReset = vi.fn();

    mockBlocker.mockReturnValue({
      state: "unblocked",
      proceed: mockProceed,
      reset: mockReset,
    });
  });

  it("should call useBlocker with correct condition", () => {
    renderHook(() =>
      useNavigationGuard({ shouldBlock: false, confirmMessage: "message" }),
    );

    expect(mockBlocker).toHaveBeenCalledWith(false);
  });

  it("should call useBlocker with false when skipGuard is true", () => {
    renderHook(() =>
      useNavigationGuard({
        shouldBlock: true,
        skipGuard: true,
        confirmMessage: "message",
      }),
    );

    expect(mockBlocker).toHaveBeenCalledWith(false);
  });

  it("should not call proceed or reset initially", () => {
    renderHook(() =>
      useNavigationGuard({ shouldBlock: false, confirmMessage: "message" }),
    );

    expect(mockProceed).not.toHaveBeenCalled();
    expect(mockReset).not.toHaveBeenCalled();
  });

  describe("when blocker is blocked", () => {
    beforeEach(() => {
      mockBlocker.mockReturnValue({
        state: "blocked",
        proceed: mockProceed,
        reset: mockReset,
      });
    });

    it("should show confirm message with correct message", () => {
      renderHook(() =>
        useNavigationGuard({
          shouldBlock: true,
          confirmMessage: "test message",
        }),
      );
      expect(mockConfirm).toHaveBeenCalledWith("test message");
    });

    it("should call proceed and onProceed when confirmed", async () => {
      mockConfirm.mockResolvedValue(true);
      const onProceed = vi.fn();
      renderHook(() =>
        useNavigationGuard({
          shouldBlock: true,
          confirmMessage: "test message",
          onProceed,
        }),
      );
      await waitFor(() => {
        expect(onProceed).toHaveBeenCalled();
        expect(mockProceed).toHaveBeenCalled();
      });
    });

    it("should call reset and onReset when confirmed", async () => {
      mockConfirm.mockResolvedValue(false);
      const onReset = vi.fn();
      renderHook(() =>
        useNavigationGuard({
          shouldBlock: true,
          confirmMessage: "test message",
          onReset,
        }),
      );
      await waitFor(() => {
        expect(onReset).toHaveBeenCalled();
        expect(mockReset).toHaveBeenCalled();
      });
    });
  });
});
