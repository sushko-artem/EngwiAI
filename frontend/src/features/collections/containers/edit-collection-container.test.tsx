import { describe, expect, it, vi } from "vitest";
import { useEditCollection } from "@features/collections/hooks";
import { fireEvent, render, screen } from "@testing-library/react";
import { EditCollectionContainer } from "./edit-collection-container";
import { MemoryRouter } from "react-router-dom";

const mockCollection = {
  name: "Test Name",
  cards: [
    { id: "1", word: "Green", translation: "Зеленый" },
    { id: "2", word: "Black", translation: "Черный" },
  ],
};

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock(import("react-router-dom"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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

  it("should call hook with correct argument", () => {
    vi.mocked(useEditCollection).mockReturnValue({
      isSaving: false,
      error: null,
      saveCollection: mockSave,
      editableCollection: mockCollection,
    });

    render(
      <MemoryRouter>
        <EditCollectionContainer collectionId="id-123" />
      </MemoryRouter>,
    );
    expect(useEditCollection).toHaveBeenCalledWith("id-123");
  });

  it("should show loader when collection is loading", () => {
    vi.mocked(useEditCollection).mockReturnValue({
      isSaving: false,
      error: null,
      saveCollection: mockSave,
      editableCollection: null,
    });

    render(
      <MemoryRouter>
        <EditCollectionContainer collectionId="id-123" />
      </MemoryRouter>,
    );
    expect(screen.getByText("Загрузка...")).toBeInTheDocument();
  });

  it("should show loader on saving edited collection", () => {
    vi.mocked(useEditCollection).mockReturnValue({
      isSaving: true,
      error: null,
      saveCollection: mockSave,
      editableCollection: mockCollection,
    });

    render(
      <MemoryRouter>
        <EditCollectionContainer collectionId="id-123" />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.getByText("Сохранение...")).toBeInTheDocument();
  });

  it("should show error when no collection and error exist", () => {
    vi.mocked(useEditCollection).mockReturnValue({
      isSaving: false,
      error: new Error("Failed to load!"),
      saveCollection: mockSave,
      editableCollection: null,
    });

    render(
      <MemoryRouter>
        <EditCollectionContainer collectionId="id-123" />
      </MemoryRouter>,
    );
    expect(screen.getByText("Error: Failed to load!")).toBeInTheDocument();
  });

  it("should navigate to '/collections' when arrow-back clicked", () => {
    vi.mocked(useEditCollection).mockReturnValue({
      isSaving: false,
      error: null,
      saveCollection: mockSave,
      editableCollection: mockCollection,
    });

    render(
      <MemoryRouter>
        <EditCollectionContainer collectionId="id-123" />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByTestId("leftIconAction"));
    expect(mockNavigate).toHaveBeenCalledWith("/collections");
  });

  it("should call saveCollection when save clicked", () => {
    vi.mocked(useEditCollection).mockReturnValue({
      isSaving: false,
      error: null,
      saveCollection: mockSave,
      editableCollection: mockCollection,
    });

    render(
      <MemoryRouter>
        <EditCollectionContainer collectionId="id-123" />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByTestId("rightIconAction"));
    expect(mockSave).toHaveBeenCalled();
  });
});
