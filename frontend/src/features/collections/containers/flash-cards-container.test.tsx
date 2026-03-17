import { describe, expect, it, vi } from "vitest";
import { useFlashCards } from "../hooks";
import { fireEvent, render, screen } from "@testing-library/react";
import { FlashCardsContainer } from "./flash-cards-container";

const mockCollection = {
  id: "testId-123",
  name: "Test Name",
  cards: [
    { id: "1", word: "Green", translation: "Зеленый" },
    { id: "2", word: "Black", translation: "Черный" },
  ],
};

const mockBack = vi.hoisted(() => vi.fn());
const mockOptions = vi.hoisted(() => vi.fn());
const mockHandleReset = vi.hoisted(() => vi.fn());
const mockHandleChosenStatus = vi.hoisted(() => vi.fn());
const mockHandleSwitchChange = vi.hoisted(() => vi.fn());
const mockHandleDelete = vi.hoisted(() => vi.fn());
const mockCloseMenu = vi.hoisted(() => vi.fn());
const mockUpdateStatus = vi.hoisted(() => vi.fn());

const createMockedProps = (overrides = {}) => ({
  error: null,
  collection: undefined,
  isLoading: false,
  unmemTerms: 0,
  isReversed: false,
  isMenuOpen: false,
  isModalOpen: false,
  index: 0,
  back: mockBack,
  options: mockOptions,
  handleReset: mockHandleReset,
  handleChosenStatus: mockHandleChosenStatus,
  handleSwitchChange: mockHandleSwitchChange,
  handleDelete: mockHandleDelete,
  closeMenu: mockCloseMenu,
  updateStatus: mockUpdateStatus,
  ...overrides,
});

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock(import("@features/collections/hooks"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useFlashCards: vi.fn(),
  };
});

describe("FlashCardsContainer", () => {
  it("should call hook with correct argument of collection id", () => {
    vi.mocked(useFlashCards).mockReturnValue(createMockedProps());
    render(<FlashCardsContainer collectionId="testId-123" />);
    expect(useFlashCards).toHaveBeenCalledWith("testId-123");
  });

  it("should show loader when loading", () => {
    vi.mocked(useFlashCards).mockReturnValue(
      createMockedProps({ isLoading: true }),
    );
    render(<FlashCardsContainer collectionId="testId-123" />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("should show error when no collection and error exist", () => {
    vi.mocked(useFlashCards).mockReturnValue(
      createMockedProps({ error: new Error("Failed to load!") }),
    );
    render(<FlashCardsContainer collectionId="testId-123" />);
    expect(screen.getByText("Error: Failed to load!")).toBeInTheDocument();
  });

  it("should render collection", () => {
    vi.mocked(useFlashCards).mockReturnValue(
      createMockedProps({ collection: mockCollection }),
    );
    render(<FlashCardsContainer collectionId="testId-123" />);
    expect(screen.getByText("Test Name")).toBeInTheDocument();
    expect(screen.getByText("Green")).toBeInTheDocument();
    expect(screen.getByText("Зеленый")).not.toBeVisible();
  });

  it("should call handleChosenStatus when clicking on chosenStatus button", () => {
    vi.mocked(useFlashCards).mockReturnValue(
      createMockedProps({ collection: mockCollection }),
    );
    render(<FlashCardsContainer collectionId="testId-123" />);
    fireEvent.click(screen.getAllByTestId("chosen-status-button")[0]);
    expect(mockHandleChosenStatus).toHaveBeenCalledWith(false);
  });

  it("should call back when clicking on back arrow", () => {
    vi.mocked(useFlashCards).mockReturnValue(
      createMockedProps({ collection: mockCollection }),
    );
    render(<FlashCardsContainer collectionId="testId-123" />);
    fireEvent.click(screen.getByTestId("leftIconAction"));
    expect(mockBack).toHaveBeenCalled();
  });

  it("should call options when clicking on options icon", () => {
    vi.mocked(useFlashCards).mockReturnValue(
      createMockedProps({ collection: mockCollection }),
    );
    render(<FlashCardsContainer collectionId="testId-123" />);
    fireEvent.click(screen.getByTestId("rightIconAction"));
    expect(mockOptions).toHaveBeenCalled();
  });

  it("should call handleSwitchChange when menu options is open and clicking on switch", () => {
    vi.mocked(useFlashCards).mockReturnValue(
      createMockedProps({ collection: mockCollection, isMenuOpen: true }),
    );
    render(<FlashCardsContainer collectionId="testId-123" />);
    fireEvent.click(screen.getByRole("switch"));
    expect(mockHandleSwitchChange).toHaveBeenCalled();
  });

  it("should call handleDelet when menu options is open and clicking on delete Button", () => {
    vi.mocked(useFlashCards).mockReturnValue(
      createMockedProps({ collection: mockCollection, isMenuOpen: true }),
    );
    render(<FlashCardsContainer collectionId="testId-123" />);
    fireEvent.click(screen.getByText("Удалить коллекцию"));
    expect(mockHandleDelete).toHaveBeenCalled();
  });

  it("should close menu options when clicking outside", () => {
    vi.mocked(useFlashCards).mockReturnValue(
      createMockedProps({ collection: mockCollection, isMenuOpen: true }),
    );
    render(<FlashCardsContainer collectionId="testId-123" />);
    fireEvent.click(screen.getByTestId("menu-overlay"));
    expect(mockCloseMenu).toHaveBeenCalled();
  });

  it("should call back when modal is open and clicking on back option", () => {
    vi.mocked(useFlashCards).mockReturnValue(
      createMockedProps({ collection: mockCollection, isModalOpen: true }),
    );
    render(<FlashCardsContainer collectionId="testId-123" />);
    fireEvent.click(screen.getByText("Выбрать другой модуль"));
    expect(mockBack).toHaveBeenCalled();
  });

  it("should call reset when modal is open and clicking on reset-module option", () => {
    vi.mocked(useFlashCards).mockReturnValue(
      createMockedProps({ collection: mockCollection, isModalOpen: true }),
    );
    render(<FlashCardsContainer collectionId="testId-123" />);
    fireEvent.click(screen.getByText("Пройти модуль заново"));
    expect(mockHandleReset).toHaveBeenCalled();
  });
});
