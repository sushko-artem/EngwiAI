import { describe, expect, it, vi } from "vitest";
import { useCreateCollection } from "../lib/";
import { fireEvent, render, screen } from "@testing-library/react";
import { CreateCollectionContainer } from "./create-collection-container";

const mockCollection = {
  name: "",
  cards: [
    { id: "1", word: "", translation: "" },
    { id: "2", word: "", translation: "" },
  ],
};

const mockNavigate = vi.hoisted(() => vi.fn());
const mockSave = vi.hoisted(() => vi.fn());

const headerProps = {
  leftIconTitle: "вернуться на главную",
  rightIconTitle: "сохранить",
  leftIconAction: () => mockNavigate("/dashboard"),
  rightIconAction: mockSave,
  leftIcon: "backArrow",
  rightIcon: "checkIcon",
  title: "Новая коллекция",
};

vi.mock("../lib/", () => ({
  useCreateCollection: vi.fn(),
}));

vi.mock("@redux/hooks", () => ({
  useAppSelector: vi.fn(() => mockCollection),
  useAppDispatch: vi.fn(),
}));

describe("CreateCollectionContainer", () => {
  it("should show loader when is loading", () => {
    vi.mocked(useCreateCollection).mockReturnValue({
      isLoading: true,
      headerProps,
      collection: null,
    });

    render(<CreateCollectionContainer />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("should show correct empty collection", () => {
    vi.mocked(useCreateCollection).mockReturnValue({
      isLoading: false,
      headerProps,
      collection: { name: "", cards: [] },
    });

    render(<CreateCollectionContainer />);

    expect(screen.getByTestId("editable-collection")).toBeInTheDocument();
    expect(screen.getByTestId("collection-name-input")).toHaveTextContent("");
  });

  it("should navigate to dashboard when back clicked and no changes", () => {
    vi.mocked(useCreateCollection).mockReturnValue({
      isLoading: false,
      headerProps,
      collection: mockCollection,
    });

    render(<CreateCollectionContainer />);
    fireEvent.click(screen.getByTestId("leftIconAction"));
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("should call saveCollection when save button clicked", () => {
    vi.mocked(useCreateCollection).mockReturnValue({
      isLoading: false,
      headerProps,
      collection: mockCollection,
    });

    render(<CreateCollectionContainer />);
    fireEvent.click(screen.getByTestId("rightIconAction"));
    expect(mockSave).toHaveBeenCalled();
  });

  it("should show correct title while saving", () => {
    const savingHeaderProps = {
      ...headerProps,
      title: "Сохранение...",
      rightIcon: undefined,
    };

    vi.mocked(useCreateCollection).mockReturnValue({
      isLoading: true,
      headerProps: savingHeaderProps,
      collection: mockCollection,
    });

    render(<CreateCollectionContainer />);

    expect(screen.getByText("Сохранение...")).toBeInTheDocument();
  });
});
