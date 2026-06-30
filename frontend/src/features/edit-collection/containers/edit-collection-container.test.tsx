import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useEditCollection } from "../lib";
import { EditCollectionContainer } from "./edit-collection-container";

const mockCollection = {
  name: "Test Name",
  cards: [
    { id: "1", word: "Green", translation: "Зеленый" },
    { id: "2", word: "Black", translation: "Черный" },
  ],
};

const mockNavigate = vi.hoisted(() => vi.fn());
const mockSave = vi.hoisted(() => vi.fn());

const headerProps = {
  leftIconTitle: "вернуться на главную",
  rightIconTitle: "сохранить",
  rightIconAction: mockSave,
  leftIconAction: () => mockNavigate("/collections"),
  leftIcon: "backArrow",
  rightIcon: "checkIcon",
  title: "Редактирование",
};

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ collectionId: "id-123" }),
  };
});

vi.mock("@redux/hooks", () => ({
  useAppDispatch: vi.fn(),
}));

vi.mock("../lib", () => ({
  useEditCollection: vi.fn(),
}));

describe("EditCollectionContainer", () => {
  it("should show loader when collection is loading", () => {
    vi.mocked(useEditCollection).mockReturnValue({
      isLoading: false,
      error: null,
      editableCollection: null,
      headerProps,
    });

    render(
      <MemoryRouter>
        <EditCollectionContainer />
      </MemoryRouter>,
    );
    expect(screen.getByText("Загрузка...")).toBeInTheDocument();
  });

  it("should show loader on saving edited collection", () => {
    vi.mocked(useEditCollection).mockReturnValue({
      isLoading: true,
      error: null,
      headerProps: {
        ...headerProps,
        title: "Сохранение...",
      },
      editableCollection: mockCollection,
    });

    render(
      <MemoryRouter>
        <EditCollectionContainer />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.getByText("Сохранение...")).toBeInTheDocument();
  });

  it("should show error when no collection and error exist", () => {
    vi.mocked(useEditCollection).mockReturnValue({
      isLoading: false,
      error: new Error("Failed to load!"),
      headerProps,
      editableCollection: null,
    });

    render(
      <MemoryRouter>
        <EditCollectionContainer />
      </MemoryRouter>,
    );
    expect(screen.getByText("Error: Failed to load!")).toBeInTheDocument();
  });

  it("should navigate to '/collections' when arrow-back clicked", () => {
    vi.mocked(useEditCollection).mockReturnValue({
      isLoading: false,
      error: null,
      headerProps,
      editableCollection: mockCollection,
    });

    render(
      <MemoryRouter>
        <EditCollectionContainer />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByTestId("leftIconAction"));
    expect(mockNavigate).toHaveBeenCalledWith("/collections");
  });

  it("should call saveCollection when save clicked", () => {
    vi.mocked(useEditCollection).mockReturnValue({
      isLoading: false,
      error: null,
      headerProps,
      editableCollection: mockCollection,
    });

    render(
      <MemoryRouter>
        <EditCollectionContainer />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByTestId("rightIconAction"));
    expect(mockSave).toHaveBeenCalled();
  });
});
