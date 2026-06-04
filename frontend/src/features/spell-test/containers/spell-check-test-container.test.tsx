import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useSpellTest } from "../lib";
import { SpellCheckTestContainer } from "./spell-check-test-container";

const mockCollection = [
  { id: "1", word: "Green", translation: "Зеленый" },
  { id: "2", word: "Black", translation: "Черный" },
];

const mockHandleAnswer = vi.hoisted(() => vi.fn());
const mockResetTest = vi.hoisted(() => vi.fn());
const mockOptions = vi.hoisted(() => vi.fn());
const mockCloseMenuOptions = vi.hoisted(() => vi.fn());
const mockPlay = vi.hoisted(() => vi.fn());
const mockToggleGroup = vi.hoisted(() => vi.fn());
const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../lib", () => ({
  useSpellTest: vi.fn(),
}));

const createMockedProps = (overrides = {}) => ({
  error: null,
  collection: [],
  isLoading: false,
  isSummaryOpen: false,
  index: 0,
  visibleSide: "word" as "word" | "translation",
  rightAnswersCount: 0,
  userMistakes: {} as Record<string, string>,
  inProgress: false,
  isMenuOptionsOpen: false,
  handleAnswer: mockHandleAnswer,
  resetTest: mockResetTest,
  options: mockOptions,
  closeMenuOptions: mockCloseMenuOptions,
  play: mockPlay,
  toggleGroup: mockToggleGroup,
  isGroupMuted: vi.fn(),
  ...overrides,
});

describe("SpellCheckTestContainer", () => {
  it("should show loader when isLoading", () => {
    vi.mocked(useSpellTest).mockReturnValue(
      createMockedProps({ isLoading: true }),
    );
    render(<SpellCheckTestContainer />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("should render wright card side", () => {
    vi.mocked(useSpellTest).mockReturnValue(
      createMockedProps({
        collection: mockCollection,
        visibleSide: "translation",
      }),
    );
    render(<SpellCheckTestContainer />);
    expect(screen.getByText("Зеленый")).toBeInTheDocument();
  });

  it("should navigate to /spell-check page when click on back", () => {
    vi.mocked(useSpellTest).mockReturnValue(
      createMockedProps({
        collection: mockCollection,
      }),
    );
    render(<SpellCheckTestContainer />);
    fireEvent.click(screen.getByTestId("leftIconAction"));
    expect(mockNavigate).toHaveBeenCalledWith("/spell-check");
  });

  it("should call handleAnswer with correct values and call playSound with correct type", () => {
    vi.mocked(useSpellTest).mockReturnValue(
      createMockedProps({
        collection: mockCollection,
      }),
    );
    render(<SpellCheckTestContainer />);
    fireEvent.click(screen.getByTestId("spell-test-answer-button"));
    expect(mockHandleAnswer).toHaveBeenCalledWith("", "Зеленый", false);
    expect(mockPlay).toHaveBeenCalledWith("incorrect");
  });

  it("should show summary modal after test completed", () => {
    vi.mocked(useSpellTest).mockReturnValue(
      createMockedProps({
        collection: mockCollection,
        isSummaryOpen: true,
      }),
    );
    render(<SpellCheckTestContainer />);
    expect(screen.getByTestId("spell-test-modal")).toBeInTheDocument();
  });

  it("shoul call options when clicking on options icon", () => {
    vi.mocked(useSpellTest).mockReturnValue(
      createMockedProps({
        collection: mockCollection,
      }),
    );
    render(<SpellCheckTestContainer />);
    fireEvent.click(screen.getByTestId("rightIconAction"));
    expect(mockOptions).toHaveBeenCalled();
  });

  it("should toggle sound when options menu is open and clicking on sound switcher", () => {
    vi.mocked(useSpellTest).mockReturnValue(
      createMockedProps({
        collection: mockCollection,
        isMenuOptionsOpen: true,
      }),
    );
    render(<SpellCheckTestContainer />);
    fireEvent.click(screen.getByTestId("switch-sound"));
    expect(mockToggleGroup).toHaveBeenCalledWith("spellTest");
  });

  it("should reset test when options menu is open and clicking on reset button", () => {
    vi.mocked(useSpellTest).mockReturnValue(
      createMockedProps({
        collection: mockCollection,
        isMenuOptionsOpen: true,
      }),
    );
    render(<SpellCheckTestContainer />);
    fireEvent.click(screen.getByTestId("menu-options-reset"));
    expect(mockResetTest).toHaveBeenCalled();
  });

  it("should reset test when summary modal is open and clicking on reset button", () => {
    vi.mocked(useSpellTest).mockReturnValue(
      createMockedProps({
        collection: mockCollection,
        isSummaryOpen: true,
      }),
    );
    render(<SpellCheckTestContainer />);
    fireEvent.click(screen.getByText("Пройти заново"));
    expect(mockResetTest).toHaveBeenCalled();
  });

  it("should navigate to /spell-check when summary modal is open and clicking on complete button", () => {
    vi.mocked(useSpellTest).mockReturnValue(
      createMockedProps({
        collection: mockCollection,
        isSummaryOpen: true,
      }),
    );
    render(<SpellCheckTestContainer />);
    fireEvent.click(screen.getByText("Завершить"));
    expect(mockNavigate).toHaveBeenCalledWith("/spell-check");
  });

  it("should navigate to /test-report page when summary modal is open and clicking on see report button", () => {
    vi.mocked(useSpellTest).mockReturnValue(
      createMockedProps({
        collection: mockCollection,
        isSummaryOpen: true,
        userMistakes: { Зеленый: "", Черный: "" },
      }),
    );
    render(<SpellCheckTestContainer />);
    fireEvent.click(screen.getByText("Отчёт об ошибках"));
    expect(mockNavigate).toHaveBeenCalledWith("/test-report", {
      state: {
        testReport: {
          mistakesReport: {
            Зеленый: "",
            Черный: "",
          },
          progress: 0,
          testType: "spell",
          totalMistakes: 2,
          totalTerms: 2,
        },
      },
    });
  });
});
