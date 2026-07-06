import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useTestReducer } from "./useTestReducer";

const mockPlay = vi.hoisted(() => vi.fn());

describe("useTestReducer", () => {
  it("should set testLength", () => {
    const { result } = renderHook(() => useTestReducer(5, mockPlay));
    expect(result.current.state.testLength).toBe(5);
  });

  describe("handleAnswer", () => {
    it("should increment index and counter for correct answer", () => {
      const { result } = renderHook(() => useTestReducer(5, mockPlay));
      act(() => {
        result.current.handleAnswer("hello", "hello");
      });
      expect(result.current.state.index).toBe(1);
      expect(result.current.state.rightAnswersCounter).toBe(1);
      expect(mockPlay).toHaveBeenCalledWith("correct");
    });

    it("should increment index but not counter for incorrect answer", () => {
      const { result } = renderHook(() => useTestReducer(5, mockPlay));
      act(() => {
        result.current.handleAnswer("hello", "world");
      });
      expect(result.current.state.index).toBe(1);
      expect(result.current.state.rightAnswersCounter).toBe(0);
      expect(mockPlay).toHaveBeenCalledWith("incorrect");
    });

    it("should save mistake for incorrect answer", () => {
      const { result } = renderHook(() => useTestReducer(5, mockPlay));
      act(() => {
        result.current.handleAnswer("hell", "hello");
        result.current.handleAnswer("word", "world");
      });
      expect(result.current.state.mistakesMadeIn).toEqual({
        hello: "hell",
        world: "word",
      });
    });

    it("should return correct status for correct answer", () => {
      const { result } = renderHook(() => useTestReducer(5, mockPlay));
      let status: string = "";
      act(() => {
        status = result.current.handleAnswer("hello", "hello");
      });
      expect(status).toBe("correct");
    });

    it("should return incorrect status for incorrect answer", () => {
      const { result } = renderHook(() => useTestReducer(5, mockPlay));
      let status: string = "";
      act(() => {
        status = result.current.handleAnswer("hell", "hello");
      });
      expect(status).toBe("incorrect");
    });

    it("should set testInProgress=false and open summaryModal when last question answered", () => {
      const { result } = renderHook(() => useTestReducer(1, mockPlay));
      act(() => {
        result.current.handleAnswer("hello", "hello");
      });
      expect(result.current.testInProgress).toBe(false);
      expect(result.current.state.isSummaryModalOpen).toBe(true);
    });
  });

  it("should toggle menu options", () => {
    const { result } = renderHook(() => useTestReducer(5, mockPlay));
    expect(result.current.state.isMenuOptionsOpen).toBe(false);
    act(() => {
      result.current.toggleMenu();
    });
    expect(result.current.state.isMenuOptionsOpen).toBe(true);
    act(() => {
      result.current.toggleMenu();
    });
    expect(result.current.state.isMenuOptionsOpen).toBe(false);
  });

  it("testInProgress should be true when index>0", () => {
    const { result } = renderHook(() => useTestReducer(5, mockPlay));
    expect(result.current.testInProgress).toBe(false);
    act(() => {
      result.current.handleAnswer("hello", "hello");
    });
    expect(result.current.state.index).toBe(1);
    expect(result.current.testInProgress).toBe(true);
  });

  it("should reset test to initial state", () => {
    const { result } = renderHook(() => useTestReducer(5, mockPlay));
    act(() => {
      result.current.handleAnswer("hello", "hello");
      result.current.handleAnswer("world", "word");
    });
    expect(result.current.state.index).toBe(2);
    expect(result.current.state.mistakesMadeIn).toEqual({
      word: "world",
    });
    expect(result.current.state.rightAnswersCounter).toBe(1);
    act(() => {
      result.current.resetTest();
    });
    expect(result.current.state.index).toBe(0);
    expect(result.current.state.mistakesMadeIn).toEqual({});
    expect(result.current.state.rightAnswersCounter).toBe(0);
    expect(result.current.state.inProgress).toBe(true);
    expect(result.current.state.isSummaryModalOpen).toBe(false);
  });
});
