import { describe, expect, it, vi } from "vitest";
import { useCreateCollection } from "@features/collections/hooks";
import { fireEvent, render, screen } from "@testing-library/react";
import { CreateCollectionContainer } from "./create-collection-container";
import { MemoryRouter } from "react-router-dom";

const mockCollection = {
  name: "",
  cards: [
    { id: "1", word: "", translation: "" },
    { id: "2", word: "", translation: "" },
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

  it("should show loader when is loading", () => {
    vi.mocked(useCreateCollection).mockReturnValue({
      isSaving: true,
      saveCollection: mockSave,
    });

    render(
      <MemoryRouter>
        <CreateCollectionContainer />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("should navigate to dashboard when back clicked and no changes", () => {
    vi.mocked(useCreateCollection).mockReturnValue({
      isSaving: false,
      saveCollection: mockSave,
    });

    render(
      <MemoryRouter>
        <CreateCollectionContainer />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByTestId("leftIconAction"));
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("should call saveCollection when save button clicked", () => {
    vi.mocked(useCreateCollection).mockReturnValue({
      isSaving: false,
      saveCollection: mockSave,
    });

    render(
      <MemoryRouter>
        <CreateCollectionContainer />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByTestId("rightIconAction"));
    expect(mockSave).toHaveBeenCalled();
  });
});
