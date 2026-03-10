import { describe, expect, it, vi } from "vitest";
import { useEditCollection } from "@features/collections/hooks";
import { fireEvent, render, screen } from "@testing-library/react";
import { EditCollectionContainer } from "./edit-collection-container";

const mockCollection = {
  name: "Test Name",
  cards: [
    { id: "1", word: "Green", translation: "Зеленый" },
    { id: "2", word: "Black", translation: "Черный" },
  ],
};

vi.mock("@redux/hooks", () => ({
  useAppDispatch: vi.fn(),
}));

vi.mock(import("@features/collections/hooks"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useEditCollection: vi.fn(),
  };
});

describe("EditCollectionContainer", () => {
  const mockSave = vi.fn();
  const mockBack = vi.fn();

  it("should call hook with correct argument", () => {
    vi.mocked(useEditCollection).mockReturnValue({
      isLoading: false,
      error: null,
      saveCollection: mockSave,
      back: mockBack,
      editableCollection: mockCollection,
    });

    render(<EditCollectionContainer collectionId="id-123" />);
    expect(useEditCollection).toHaveBeenCalledWith("id-123");
  });

  it("should show loader when collection is loading", () => {
    vi.mocked(useEditCollection).mockReturnValue({
      isLoading: false,
      error: null,
      saveCollection: mockSave,
      back: mockBack,
      editableCollection: null,
    });

    render(<EditCollectionContainer collectionId="id-123" />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("should show loader on saving edited collection", () => {
    vi.mocked(useEditCollection).mockReturnValue({
      isLoading: true,
      error: null,
      saveCollection: mockSave,
      back: mockBack,
      editableCollection: mockCollection,
    });

    render(<EditCollectionContainer collectionId="id-123" />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.getByText("Сохранение...")).toBeInTheDocument();
  });

  it("should show error when no collection and error exist", () => {
    vi.mocked(useEditCollection).mockReturnValue({
      isLoading: false,
      error: new Error("Failed to load!"),
      saveCollection: mockSave,
      back: mockBack,
      editableCollection: mockCollection,
    });

    render(<EditCollectionContainer collectionId="id-123" />);
    expect(screen.getByText("Error: Failed to load!")).toBeInTheDocument();
  });

  it("should call back when arrow-back clicked", () => {
    vi.mocked(useEditCollection).mockReturnValue({
      isLoading: false,
      error: null,
      saveCollection: mockSave,
      back: mockBack,
      editableCollection: mockCollection,
    });

    render(<EditCollectionContainer collectionId="id-123" />);
    fireEvent.click(screen.getByTestId("leftIconAction"));
    expect(mockBack).toHaveBeenCalled();
  });

  it("should call saveCollection when save clicked", () => {
    vi.mocked(useEditCollection).mockReturnValue({
      isLoading: false,
      error: null,
      saveCollection: mockSave,
      back: mockBack,
      editableCollection: mockCollection,
    });

    render(<EditCollectionContainer collectionId="id-123" />);
    fireEvent.click(screen.getByTestId("rightIconAction"));
    expect(mockSave).toHaveBeenCalled();
  });
});
