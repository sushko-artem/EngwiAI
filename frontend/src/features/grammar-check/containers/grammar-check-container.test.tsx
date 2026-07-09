import { describe, expect, it, vi } from "vitest";
import { useGrammarCheck } from "../lib";
import { fireEvent, render, screen } from "@testing-library/react";
import { GrammarCheckContainer } from "./grammar-check-container";
import { MemoryRouter } from "react-router-dom";

const mockCollections = [
  {
    name: "FirstCollection",
    id: "id-111",
  },
  {
    name: "SecondCollection",
    id: "id-222",
  },
  {
    name: "ThirdCollection",
    id: "id-333",
  },
];

const mockBack = vi.hoisted(() => vi.fn());
const mockStartTest = vi.hoisted(() => vi.fn());
const mockSetSide = vi.hoisted(() => vi.fn());
const mockSetDifficulty = vi.hoisted(() => vi.fn());
const mockSetCount = vi.hoisted(() => vi.fn());
const mockSetChosenCollection = vi.hoisted(() => vi.fn());

const headerProps = {
  title: "Title",
  leftIcon: "backArrow",
  leftIconTitle: "IconTitle",
  leftIconAction: () => mockBack("/dashboard"),
};

const createMockedProps = (overrides = {}) => ({
  headerProps,
  isLoading: false,
  error: null,
  startTest: mockStartTest,
  collections: undefined,
  cardSide: "word" as "word" | "translation",
  setCardSide: mockSetSide,
  setChosenId: mockSetChosenCollection,
  chosenId: "",
  difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
  setDifficulty: mockSetDifficulty,
  count: "5" as "5" | "7" | "10",
  setCount: mockSetCount,
  ...overrides,
});

vi.mock("../lib", () => ({
  useGrammarCheck: vi.fn(),
}));

describe("GrammarCheckContainer", () => {
  it("should show loader when loading", () => {
    vi.mocked(useGrammarCheck).mockReturnValue(
      createMockedProps({ isLoading: true }),
    );
    render(<GrammarCheckContainer />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("shoul show default page with proposition to create collection when collections array is empty", () => {
    vi.mocked(useGrammarCheck).mockReturnValue(
      createMockedProps({ collections: [] }),
    );
    render(
      <MemoryRouter>
        <GrammarCheckContainer />
      </MemoryRouter>,
    );
    expect(
      screen.getByText("Ни одного модуля пока не создано!"),
    ).toBeInTheDocument();
  });

  it("should render correctly", () => {
    vi.mocked(useGrammarCheck).mockReturnValue(
      createMockedProps({ collections: mockCollections }),
    );
    render(<GrammarCheckContainer />);
    expect(screen.getByText("FirstCollection")).toBeInTheDocument();
  });

  it("should navigate to '/dashboard' when clicking on back", () => {
    vi.mocked(useGrammarCheck).mockReturnValue(
      createMockedProps({ collections: mockCollections }),
    );
    render(<GrammarCheckContainer />);
    fireEvent.click(screen.getByTestId("leftIconAction"));
    expect(mockBack).toHaveBeenCalledWith("/dashboard");
  });

  it("should choose single collection for test", () => {
    vi.mocked(useGrammarCheck).mockReturnValue(
      createMockedProps({ collections: mockCollections, chosenId: "" }),
    );
    const { rerender } = render(<GrammarCheckContainer />);
    fireEvent.click(screen.getAllByTestId("chosen-module")[0]);
    expect(mockSetChosenCollection).toHaveBeenCalledWith("id-111");
    vi.mocked(useGrammarCheck).mockReturnValue(
      createMockedProps({ collections: mockCollections, chosenId: "id-111" }),
    );
    rerender(<GrammarCheckContainer />);
    expect(screen.getAllByTestId("chosen-module")[0]).toHaveAttribute(
      "data-state",
      "chosen",
    );
    fireEvent.click(screen.getAllByTestId("chosen-module")[1]);
    expect(mockSetChosenCollection).toHaveBeenCalledWith("id-222");

    vi.mocked(useGrammarCheck).mockReturnValue(
      createMockedProps({ collections: mockCollections, chosenId: "id-222" }),
    );
    rerender(<GrammarCheckContainer />);
    expect(screen.getAllByTestId("chosen-module")[0]).toHaveAttribute(
      "data-state",
      "unchosen",
    );
    expect(screen.getAllByTestId("chosen-module")[1]).toHaveAttribute(
      "data-state",
      "chosen",
    );
  });

  it("should set card side", () => {
    vi.mocked(useGrammarCheck).mockReturnValue(
      createMockedProps({ collections: mockCollections }),
    );
    render(<GrammarCheckContainer />);
    fireEvent.click(screen.getByTestId("translation"));
    expect(mockSetSide).toHaveBeenCalledWith("translation");
  });

  it("should set difficulty", () => {
    vi.mocked(useGrammarCheck).mockReturnValue(
      createMockedProps({ collections: mockCollections }),
    );
    render(<GrammarCheckContainer />);
    fireEvent.click(screen.getByTestId("intermediate"));
    expect(mockSetDifficulty).toHaveBeenCalledWith("intermediate");
  });

  it("should set count of generated sentences", () => {
    vi.mocked(useGrammarCheck).mockReturnValue(
      createMockedProps({ collections: mockCollections }),
    );
    render(<GrammarCheckContainer />);
    fireEvent.click(screen.getByTestId("7_tenses"));
    expect(mockSetCount).toHaveBeenCalledWith("7");
  });

  it("should start test when clicking on startTest button", () => {
    vi.mocked(useGrammarCheck).mockReturnValue(
      createMockedProps({ collections: mockCollections }),
    );
    render(<GrammarCheckContainer />);
    fireEvent.click(screen.getByTestId("start-test"));
    expect(mockStartTest).toHaveBeenCalled();
  });
});
