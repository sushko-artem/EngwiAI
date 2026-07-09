import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSpellCheck } from "../lib/";
import { fireEvent, render, screen } from "@testing-library/react";
import { SpellCheckContainer } from "./spell-check-container";
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
const mockToggle = vi.hoisted(() => vi.fn());
const mockStartTest = vi.hoisted(() => vi.fn());
const mockSetSide = vi.hoisted(() => vi.fn());

const headerProps = {
  title: "Title",
  leftIcon: "backArrow",
  leftIconTitle: "IconTitle",
  leftIconAction: mockBack,
};

vi.mock("../lib", () => ({
  useSpellCheck: vi.fn(),
}));

describe("SpellCheckContainer", () => {
  let mockSetIds: Set<string>;

  beforeEach(() => {
    mockSetIds = new Set<string>();
  });

  const createMockedProps = (overrides = {}) => ({
    collections: undefined,
    error: null,
    isLoading: false,
    chosenIds: mockSetIds,
    visibleSide: "word" as "word" | "translation",
    refetch: vi.fn(),
    headerProps,
    toggleChoosenModule: mockToggle,
    startTest: mockStartTest,
    setVisibleSide: mockSetSide,
    ...overrides,
  });

  it("should show loader when loading", () => {
    vi.mocked(useSpellCheck).mockReturnValue(
      createMockedProps({ isLoading: true }),
    );
    render(<SpellCheckContainer />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("should show error page when error", () => {
    vi.mocked(useSpellCheck).mockReturnValue(
      createMockedProps({ error: new Error("Query failed!") }),
    );
    render(
      <MemoryRouter>
        <SpellCheckContainer />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("query-collections-error")).toBeInTheDocument();
    expect(screen.getByText("Error: Query failed!")).toBeInTheDocument();
  });

  it("shoul show default page with proposition to create collection when collections array is empty", () => {
    vi.mocked(useSpellCheck).mockReturnValue(
      createMockedProps({ collections: [] }),
    );
    render(
      <MemoryRouter>
        <SpellCheckContainer />
      </MemoryRouter>,
    );
    expect(
      screen.getByText("Ни одного модуля пока не создано!"),
    ).toBeInTheDocument();
  });

  it("should render correctly", () => {
    vi.mocked(useSpellCheck).mockReturnValue(
      createMockedProps({ collections: mockCollections }),
    );
    render(<SpellCheckContainer />);
    expect(screen.getByText("FirstCollection")).toBeInTheDocument();
  });

  it("should call handleBack when clicked on back", () => {
    vi.mocked(useSpellCheck).mockReturnValue(
      createMockedProps({ collections: mockCollections }),
    );
    render(<SpellCheckContainer />);
    fireEvent.click(screen.getByTestId("leftIconAction"));
    expect(mockBack).toHaveBeenCalled();
  });

  it("should call toggleChoosenModule when clicked on module item", () => {
    vi.mocked(useSpellCheck).mockReturnValue(
      createMockedProps({ collections: mockCollections }),
    );
    render(<SpellCheckContainer />);
    fireEvent.click(screen.getAllByTestId("chosen-module")[0]);
    expect(mockToggle).toHaveBeenCalledWith("id-111");
  });

  it("should call startTest when button start clicked", () => {
    vi.mocked(useSpellCheck).mockReturnValue(
      createMockedProps({ collections: mockCollections }),
    );
    render(<SpellCheckContainer />);
    fireEvent.click(screen.getByTestId("start-test"));
    expect(mockStartTest).toHaveBeenCalled();
  });

  it("should call setVisibleSide when radio changed", () => {
    vi.mocked(useSpellCheck).mockReturnValue(
      createMockedProps({ collections: mockCollections }),
    );
    render(<SpellCheckContainer />);
    fireEvent.click(screen.getByTestId("translation"));
    expect(mockSetSide).toHaveBeenCalledWith("translation");
  });
});
