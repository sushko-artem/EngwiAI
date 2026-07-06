import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useSound } from "./useSound";

const mockPlay = vi.hoisted(() => vi.fn());
const mockMute = vi.hoisted(() => vi.fn());

vi.mock("@shared/constants/sounds", () => ({
  sounds: {
    correct: { play: mockPlay, mute: mockMute },
    incorrect: { play: mockPlay, mute: mockMute },
  },
  SOUND_GROUP: {
    TestGroup: ["correct", "incorrect"],
  },
}));

describe("useSound", () => {
  it("should mute all sounds on mount", () => {
    renderHook(() => useSound());
    expect(mockMute).toHaveBeenCalledWith(false);
    expect(mockMute).toHaveBeenCalledTimes(2);
  });

  it("should play sound", () => {
    const { result } = renderHook(() => useSound());
    act(() => {
      result.current.play("correct");
    });
    expect(mockPlay).toHaveBeenCalled();
  });

  it("should toggleGroup mute state", () => {
    const { result } = renderHook(() => useSound());
    expect(result.current.isGroupMuted("TestGroup")).toBe(false);
    act(() => {
      result.current.toggleGroup("TestGroup");
    });
    expect(result.current.isGroupMuted("TestGroup")).toBe(true);
    expect(mockMute).toHaveBeenCalledWith(true);
    act(() => {
      result.current.toggleGroup("TestGroup");
    });
    expect(result.current.isGroupMuted("TestGroup")).toBe(false);
    expect(mockMute).toHaveBeenCalledWith(false);
  });

  it("should mute all sounds", () => {
    const { result } = renderHook(() => useSound());
    act(() => {
      result.current.muteAll();
    });
    expect(mockMute).toHaveBeenCalledWith(true);
    expect(result.current.isGroupMuted("TestGroup")).toBe(true);
  });

  it("should unmute all sounds", () => {
    const { result } = renderHook(() => useSound());
    act(() => {
      result.current.muteAll();
    });
    act(() => {
      result.current.unMuteAll();
    });
    expect(mockMute).toHaveBeenCalledWith(false);
    expect(result.current.isGroupMuted("TestGroup")).toBe(false);
  });
});
