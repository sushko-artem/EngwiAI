import { describe, expect, it, vi } from "vitest";
import { useCreateCollection } from "@features/collections/hooks";
import { fireEvent, render, screen } from "@testing-library/react";
import { CreateCollectionContainer } from "./create-collection-container";

const mockCollection = {
  name: "",
  cards: [
    { id: "1", word: "", translation: "" },
    { id: "2", word: "", translation: "" },
  ],
};

vi.mock(import("@features/collections/hooks"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useCreateCollection: vi.fn(),
  };
});

vi.mock("@redux/hooks", () => ({
  useAppSelector: vi.fn(() => mockCollection),
  useAppDispatch: vi.fn(),
}));

describe("CreateCollectionContainer", () => {
  const mockSave = vi.fn();
  const mockBack = vi.fn();

  it("should show loader when is loading", () => {
    vi.mocked(useCreateCollection).mockReturnValue({
      isLoading: true,
      saveCollection: mockSave,
      back: mockBack,
    });

    render(<CreateCollectionContainer />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("should call back when arrow-back clicked", () => {
    vi.mocked(useCreateCollection).mockReturnValue({
      isLoading: false,
      saveCollection: mockSave,
      back: mockBack,
    });

    render(<CreateCollectionContainer />);
    fireEvent.click(screen.getByTestId("leftIconAction"));
    expect(mockBack).toHaveBeenCalled();
  });

  it("should call saveCollection when save clicked", () => {
    vi.mocked(useCreateCollection).mockReturnValue({
      isLoading: false,
      saveCollection: mockSave,
      back: mockBack,
    });

    render(<CreateCollectionContainer />);
    fireEvent.click(screen.getByTestId("rightIconAction"));
    expect(mockSave).toHaveBeenCalled();
  });
});
