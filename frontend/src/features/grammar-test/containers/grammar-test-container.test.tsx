import { describe, expect, it, vi } from "vitest";
import { useGrammarTest } from "../lib";
import { render, screen } from "@testing-library/react";
import { GrammarTestContainer } from "./grammar-test-container";
import { MemoryRouter } from "react-router-dom";

const sentences = {
  shuffledSentences: [
    {
      id: "1",
      word: "one",
    },
    {
      id: "2",
      word: "two",
    },
    {
      id: "3",
      word: "three",
    },
  ],
  translations: "раз два три",
};

const mockOptions = vi.hoisted(() => vi.fn());
const mockNavigate = vi.hoisted(() => vi.fn());
const mockResetTest = vi.hoisted(() => vi.fn());
const mockCloseMenu = vi.hoisted(() => vi.fn());

const headerProps = {
  title: "Title",
  leftIcon: "Left Icon",
  leftIconTitle: "Left Icon title",
  rightIcon: "Right Icon",
  leftIconAction: () => mockNavigate("/grammar-check"),
  rightIconAction: () => mockOptions,
};

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../lib", () => ({
  useGrammarTest: vi.fn(),
}));

const createMockProps = (overrides = {}) => ({
  headerProps,
  translation: sentences.translations,
  shuffledWords: sentences.shuffledSentences,
  isLoading: false,
  error: null,
  index: 0,
  borderType: null,
  handleUserAnswer: vi.fn(),
  handleDragEnd: vi.fn(),
  testLength: 1,
  isSummaryOpen: false,
  rightAnswersCount: 0,
  userMistakes: {},
  resetTest: mockResetTest,
  isMenuOptionsOpen: false,
  closeMenu: mockCloseMenu,
  isGroupMuted: vi.fn(),
  play: vi.fn(),
  toggleGroup: vi.fn(),
  inProgress: false,
  ...overrides,
});

describe("GrammarTestContainer", () => {
  it("should show loader when loading", () => {
    vi.mocked(useGrammarTest).mockReturnValue(
      createMockProps({ isLoading: true }),
    );
    render(<GrammarTestContainer />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("should show generation error when error", () => {
    vi.mocked(useGrammarTest).mockReturnValue(
      createMockProps({ error: new Error("Generation Error") }),
    );
    render(
      <MemoryRouter>
        <GrammarTestContainer />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("generation-error")).toBeInTheDocument();
    expect(screen.getByText("Error: Generation Error")).toBeInTheDocument();
  });

  it("should show generation error when AI returned an empty data", () => {
    vi.mocked(useGrammarTest).mockReturnValue(
      createMockProps({ testLength: 0 }),
    );
    render(
      <MemoryRouter>
        <GrammarTestContainer />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("generation-error")).toBeInTheDocument();
  });

  it("should render correctly", () => {
    vi.mocked(useGrammarTest).mockReturnValue(createMockProps());
    render(<GrammarTestContainer />);
    expect(screen.getByText("раз два три")).toBeInTheDocument();
  });

  it("should show summary modal with analysis button when test finished", () => {
    vi.mocked(useGrammarTest).mockReturnValue(
      createMockProps({
        isSummaryOpen: true,
        rightAnswersCount: 0,
        userMistakes: {
          "one two three": "one three two",
        },
      }),
    );
    render(<GrammarTestContainer />);
    expect(screen.getAllByTestId("modal-action")).toHaveLength(3);
    expect(screen.getByTestId("test-modal")).toBeInTheDocument();
  });

  it("should show summary modal without analysis button when test finished and no mistakes", () => {
    vi.mocked(useGrammarTest).mockReturnValue(
      createMockProps({
        isSummaryOpen: true,
        rightAnswersCount: 1,
        userMistakes: {},
      }),
    );
    render(<GrammarTestContainer />);
    expect(screen.getAllByTestId("modal-action")).toHaveLength(2);
    expect(screen.getByTestId("test-modal")).toBeInTheDocument();
  });

  it("should show menu Option", () => {
    vi.mocked(useGrammarTest).mockReturnValue(
      createMockProps({
        isMenuOptionsOpen: true,
      }),
    );
    render(<GrammarTestContainer />);
    expect(screen.getByTestId("menu-options")).toBeInTheDocument();
  });
});
