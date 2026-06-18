import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useSpellTest } from "./useSpellTest";

const cards = [
  {
    id: "1",
    word: "hello",
    translation: "привет",
  },
  {
    id: "2",
    word: "world",
    translation: "мир",
  },
];

const mockNavigate = vi.hoisted(() => vi.fn());
const mockBlocker = vi.hoisted(() => vi.fn());
const mockUseNavigationGuard = vi.hoisted(() => vi.fn());
const mockGetCards = vi.hoisted(() => vi.fn());
const mockPreventReload = vi.hoisted(() => vi.fn());
const mockLocationState = { modules: [] as string[], visibleSide: "word" };

vi.mock(import("@shared/hooks"), async (importOriginal) => {
  const actual = await importOriginal();
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

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useBlocker: mockBlocker,
  useLocation: () => ({
    state: mockLocationState,
  }),
}));

vi.mock("@entities/collection/api", () => ({
  useGetCardsFromCollectionsMutation: () => [
    mockGetCards,
    {
      data: cards,
      isLoading: false,
      error: null,
    },
  ],
}));
describe("useSpellTest", () => {
  it("should navigate to /spell-check when no modules in location state", () => {
    renderHook(() => useSpellTest());
    expect(mockNavigate).toHaveBeenCalledWith("/spell-check");
  });

  it("should load cards correctly when modules exist", () => {
    mockLocationState.modules = ["1", "2"];

    const { result } = renderHook(() => useSpellTest());

    vi.waitFor(() => {
      expect(result.current.collection).toMatchObject(cards);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should pass correct params to useNavigationGuard", () => {
    mockLocationState.modules = ["1", "2"];

    renderHook(() => useSpellTest());

    expect(mockUseNavigationGuard).toHaveBeenCalledWith({
      shouldBlock: false,
      confirmMessage:
        "Тест не окончен! Вы действительно хотите покинуть страницу?",
    });
  });

  it("should call usePreventReload with correct value", () => {
    mockLocationState.modules = ["1", "2"];
    renderHook(() => useSpellTest());
    expect(mockPreventReload).toHaveBeenCalledWith(false);
  });

  it("should update shouldBlock when test progresses", async () => {
    mockLocationState.modules = ["1", "2"];

    const { result, rerender } = renderHook(() => useSpellTest());

    await waitFor(() => {
      expect(result.current.collection).toHaveLength(2);
    });

    mockUseNavigationGuard.mockClear();
    expect(result.current.index).toBe(0);

    act(() => {
      result.current.handleAnswer("hello", "hello", true);
    });

    rerender();

    expect(mockUseNavigationGuard).toHaveBeenCalledWith(
      expect.objectContaining({
        shouldBlock: true,
      }),
    );
  });

  it("should reset state on resetTest", async () => {
    mockLocationState.modules = ["1", "2"];

    const { result } = renderHook(() => useSpellTest());

    await waitFor(() => {
      expect(result.current.collection).toHaveLength(2);
    });

    act(() => {
      result.current.handleAnswer("hello", "hello", true);
    });

    act(() => {
      result.current.resetTest();
    });

    expect(result.current.index).toBe(0);
    expect(result.current.rightAnswersCount).toBe(0);
  });

  it("should toggle and close menu options", () => {
    mockLocationState.modules = ["1", "2"];

    const { result } = renderHook(() => useSpellTest());

    act(() => {
      result.current.options();
    });

    expect(result.current.isMenuOptionsOpen).toBe(true);

    act(() => {
      result.current.closeMenuOptions();
    });

    expect(result.current.isMenuOptionsOpen).toBe(false);
  });
});
