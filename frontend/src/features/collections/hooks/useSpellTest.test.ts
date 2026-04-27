import { act, renderHook } from "@testing-library/react";
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
const mockLocationState = { modules: [] as string[], visibleSide: "word" };

vi.mock("@shared/hooks", () => ({
  useNavigationGuard: mockUseNavigationGuard,
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useBlocker: mockBlocker,
  useLocation: () => ({
    pathname: "/spell-check/test",
    state: mockLocationState,
  }),
}));

vi.mock("@features/collections/api", () => ({
  useGetCardsFromCollectionsMutation: () => [
    mockGetCards,
    { isLoading: false, error: null },
  ],
}));

describe("useSpellTest", () => {
  it("should navigate to /spell-check when no modules in location state", () => {
    renderHook(() => useSpellTest());
    expect(mockNavigate).toHaveBeenCalledWith("/spell-check");
  });

  it("should load cards correctly when modules exist", () => {
    mockLocationState.modules = ["1", "2"];

    mockGetCards.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({ cards }),
    });

    const { result } = renderHook(() => useSpellTest());

    vi.waitFor(() => {
      expect(result.current.collection).toMatchObject(cards);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should pass correct params to useNavigationGuard", () => {
    mockLocationState.modules = ["1", "2"];

    mockGetCards.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({ cards }),
    });

    renderHook(() => useSpellTest());

    expect(mockUseNavigationGuard).toHaveBeenCalledWith({
      shouldBlock: false,
      confirmMessage:
        "Тест не окончен! Вы действительно хотите покинуть страницу?",
    });
  });

  it("should update shouldBlock when test progresses", async () => {
    mockLocationState.modules = ["1", "2"];

    mockGetCards.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue(cards),
    });

    const { result, rerender } = renderHook(() => useSpellTest());

    await vi.waitFor(() => {
      expect(result.current.collection).toHaveLength(2);
    });

    mockUseNavigationGuard.mockClear();
    expect(result.current.index).toBe(0);

    act(() => {
      result.current.handleAnswer("hello", "hello");
    });

    rerender();

    expect(mockUseNavigationGuard).toHaveBeenCalledWith(
      expect.objectContaining({
        shouldBlock: true,
      }),
    );
  });
});
