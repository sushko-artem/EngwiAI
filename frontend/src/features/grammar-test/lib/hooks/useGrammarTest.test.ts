import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGrammarTest } from "./useGrammarTest";

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
  };
});

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

  // it("should handle generation error", async () => {
  //   mockGenerateSentences.mockReturnValue({
  //     unwrap: vi.fn().mockRejectedValue(new Error("Generation error!")),
  //   });
  //   sessionStorage.getItem = vi.fn(() => null);
  //   const { result } = renderHook(() => useGrammarTest());
  //   await waitFor(() => {
  //     expect(result.current.error).toBe("Generation error!");
  //   });
  // });
});
