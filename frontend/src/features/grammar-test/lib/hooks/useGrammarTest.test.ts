/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGrammarTest } from "./useGrammarTest";
import { act } from "react";

const mockData = {
  sentences: [
    { terms: "", sentence: "Hello, World!", translation: "Привет, Мир!" },
    { terms: "", sentence: "One, two, three", translation: "Раз, два, три" },
  ],
};

const mockUseNavigationGuard = vi.hoisted(() => vi.fn());
const mockPreventReload = vi.hoisted(() => vi.fn());
const mockNavigate = vi.hoisted(() => vi.fn());
const mockGenerateSentences = vi.hoisted(() => vi.fn());
const mockLocation = vi.hoisted(() => vi.fn());
const mockHandleAnswer = vi.hoisted(() => vi.fn());
const mockState = {
  index: 0,
  inProgress: false,
  isMenuOptionsOpen: false,
  isSummaryModalOpen: false,
  rightAnswersCounter: 0,
  mistakesMadeIn: [],
};

vi.mock("@shared/hooks", async () => {
  const actual =
    await vi.importActual<typeof import("@shared/hooks")>("@shared/hooks");
  return {
    ...actual,
    useNavigationGuard: mockUseNavigationGuard,
    usePreventReload: mockPreventReload,
    useSound: () => ({
      play: vi.fn(),
      toggleGroup: vi.fn(),
      isGroupMuted: vi.fn(),
      muteAll: vi.fn(),
      unMuteAll: vi.fn(),
    }),
    useTestReducer: () => ({
      state: mockState,
      handleAnswer: mockHandleAnswer,
      toggleMenu: vi.fn(),
      closeMenu: vi.fn(),
      resetTest: vi.fn(),
      testInProgress: false,
    }),
  };
});

vi.mock("@dnd-kit/react/sortable", () => ({
  useSortable: () => ({ ref: vi.fn(), isDragging: false }),
  isSortable: () => true,
}));

vi.mock("@features/grammar-test/api/ai-api", () => ({
  useGenerateSentencesMutation: () => [
    mockGenerateSentences,
    {
      data: mockData,
      isLoading: false,
      error: null,
    },
  ],
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: mockLocation,
}));

describe("useGrammarTest", () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockLocation.mockReturnValue({
      state: {
        chosenId: "id-123",
        difficulty: "beginner",
        cardSide: "word",
        numberCount: 2,
      },
    });
    mockGenerateSentences.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue(mockData),
    });
    mockHandleAnswer.mockReturnValue("correct");
  });
  describe("state transitions", () => {
    it("should have correct initial state values", () => {
      const { result } = renderHook(() => useGrammarTest());

      expect(result.current.index).toBe(0);
      expect(result.current.rightAnswersCount).toBe(0);
      expect(result.current.userMistakes).toEqual([]);
      expect(result.current.borderType).toBeNull();
      expect(result.current.isMenuOptionsOpen).toBe(false);
      expect(result.current.isSummaryOpen).toBe(false);
    });
  });

  it("should navigate to 'grammar-check' when no data in location state", () => {
    mockLocation.mockReturnValue({ state: null });
    renderHook(() => useGrammarTest());
    expect(mockNavigate).toHaveBeenCalledWith("/grammar-check");
  });

  it("should pass correct params to useNavigationGuard", () => {
    renderHook(() => useGrammarTest());
    expect(mockUseNavigationGuard).toHaveBeenCalledWith(
      expect.objectContaining({
        shouldBlock: false,
        confirmMessage: expect.any(String),
      }),
    );
  });

  it("should call usePreventReload with correct value", () => {
    renderHook(() => useGrammarTest());
    expect(mockPreventReload).toHaveBeenCalledWith(false);
  });

  it("should call generateSenteces with correct params", () => {
    renderHook(() => useGrammarTest());
    expect(mockGenerateSentences).toHaveBeenCalledWith({
      id: "id-123",
      difficulty: "beginner",
      cardSide: "word",
      count: 2,
    });
  });

  it("should save data into sessionStorage", async () => {
    renderHook(() => useGrammarTest());
    await waitFor(() => {
      const cached = sessionStorage.getItem("grammar_test_cache");
      expect(cached).not.toBeNull();
      expect(JSON.parse(cached!)).toHaveProperty("sentences");
    });
  });

  it("should not call generateSentences if cached data in sessionStorage", () => {
    sessionStorage.setItem("grammar_test_cache", JSON.stringify(mockData));
    renderHook(() => useGrammarTest());
    expect(mockGenerateSentences).not.toHaveBeenCalled();
  });

  it("translation property should be correct", () => {
    const { result } = renderHook(() => useGrammarTest());
    expect(result.current.translation).toBe("Привет, Мир!");
  });

  it("shuffled words contains correct data", () => {
    const { result } = renderHook(() => useGrammarTest());
    const words = result.current.shuffledWords.map((w) => w.word).sort();
    expect(words).toEqual(["Hello", "World"]);
  });

  it("testLength should have correct data", () => {
    const { result } = renderHook(() => useGrammarTest());
    expect(result.current.testLength).toBe(2);
  });

  describe("handleDragEnd", () => {
    it("should reorder shuffledWords when item is moved", () => {
      const { result } = renderHook(() => useGrammarTest());
      const initOrder = result.current.shuffledWords.map((w) => w.id);
      act(() => {
        result.current.handleDragEnd({
          canceled: false,
          operation: {
            source: {
              type: "sortable",
              initialIndex: 0,
              index: 1,
            },
          },
        } as any);
      });
      const newOrder = result.current.shuffledWords.map((w) => w.id);
      expect(newOrder).not.toEqual(initOrder);
    });

    it("should not change shuffledWords when item dropped in same position", () => {
      const { result } = renderHook(() => useGrammarTest());
      const initOrder = [...result.current.shuffledWords];
      act(() => {
        result.current.handleDragEnd({
          canceled: false,
          operation: {
            source: {
              type: "sortable",
              initialIndex: 0,
              index: 0,
            },
          },
        } as any);
      });
      expect(result.current.shuffledWords).toEqual(initOrder);
    });
  });

  describe("handleUserAnswer", () => {
    it("should update borderType when answer is correct", async () => {
      const { result } = renderHook(() => useGrammarTest());

      act(() => {
        result.current.handleUserAnswer();
      });

      await waitFor(() => {
        expect(result.current.borderType).toBe("correct");
      });
    });

    it("should update borderType to 'incorrect' when answer is wrong", async () => {
      mockHandleAnswer.mockReturnValue("incorrect");
      const { result } = renderHook(() => useGrammarTest());

      act(() => {
        result.current.handleUserAnswer();
      });

      await waitFor(() => {
        expect(result.current.borderType).toBe("incorrect");
      });
    });
  });

  it("should call handleUserAnswer when Enter key is pressed", async () => {
    renderHook(() => useGrammarTest());
    mockHandleAnswer.mockClear();

    act(() => {
      const event = new KeyboardEvent("keydown", { key: "Enter" });
      document.dispatchEvent(event);
    });

    await waitFor(() => {
      expect(mockHandleAnswer).toHaveBeenCalled();
    });
  });

  it("should NOT call handleUserAnswer when Enter key is pressed and options menu is open", async () => {
    mockState.isMenuOptionsOpen = true;
    renderHook(() => useGrammarTest());
    mockHandleAnswer.mockClear();

    act(() => {
      const event = new KeyboardEvent("keydown", { key: "Enter" });
      document.dispatchEvent(event);
    });

    await waitFor(() => {
      expect(mockHandleAnswer).not.toHaveBeenCalled();
    });
  });
});
