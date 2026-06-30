import { describe, expect, it, vi } from "vitest";
import { useCollections } from "../lib";
import { fireEvent, render, screen } from "@testing-library/react";
import { CollectionsListContainer } from "./collections-list-container";
import { MemoryRouter } from "react-router-dom";

const headerProps = {
  leftIconTitle: "IconTitle",
  rightIconTitle: "IconTitle",
  leftIconAction: () => mockNavigate("/dashboard"),
  leftIcon: "backArrow",
  rightIcon: "option",
  title: "Title",
};

const mockCollections = [
  {
    name: "FirstCollection",
    id: "first_id",
  },
  {
    name: "SecondCollection",
    id: "second_id",
  },
];

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock("../lib", () => ({
  useCollections: vi.fn(),
}));

describe("CollectionsListContainer", () => {
  const mockOnDelete = vi.fn();

  it("should show loader when loading", () => {
    vi.mocked(useCollections).mockReturnValue({
      collections: undefined,
      isLoading: true,
      error: null,
      isRefetching: false,
      onDelete: mockOnDelete,
      headerProps,
    });

    render(
      <MemoryRouter>
        <CollectionsListContainer />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("should show error when no collections and error exist", () => {
    vi.mocked(useCollections).mockReturnValue({
      collections: undefined,
      isLoading: false,
      error: new Error("Failed to load!"),
      isRefetching: false,
      onDelete: mockOnDelete,
      headerProps,
    });

    render(
      <MemoryRouter>
        <CollectionsListContainer />
      </MemoryRouter>,
    );
    expect(screen.getByText("Error: Failed to load!")).toBeInTheDocument();
  });

  it("shoul show default page with proposition to create collection when collections array is empty", () => {
    vi.mocked(useCollections).mockReturnValue({
      collections: [],
      isLoading: false,
      error: null,
      isRefetching: false,
      onDelete: mockOnDelete,
      headerProps,
    });

    render(
      <MemoryRouter>
        <CollectionsListContainer />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("Ни одного модуля пока не создано!"),
    ).toBeInTheDocument();
  });

  it("should render collections list when data exist", () => {
    vi.mocked(useCollections).mockReturnValue({
      collections: mockCollections,
      isLoading: false,
      error: null,
      isRefetching: false,
      onDelete: mockOnDelete,
      headerProps,
    });

    render(
      <MemoryRouter>
        <CollectionsListContainer />
      </MemoryRouter>,
    );
    expect(screen.getByText("FirstCollection")).toBeInTheDocument();
    expect(screen.getByText("SecondCollection")).toBeInTheDocument();
  });

  it("should navigate to '/dashboard' when arrow-back clicked", () => {
    vi.mocked(useCollections).mockReturnValue({
      collections: mockCollections,
      isLoading: false,
      error: null,
      isRefetching: false,
      onDelete: mockOnDelete,
      headerProps,
    });

    render(
      <MemoryRouter>
        <CollectionsListContainer />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTestId("leftIconAction"));
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("should call onDelete when delete clicked", () => {
    vi.mocked(useCollections).mockReturnValue({
      collections: mockCollections,
      isLoading: false,
      error: null,
      isRefetching: false,
      onDelete: mockOnDelete,
      headerProps,
    });

    render(
      <MemoryRouter>
        <CollectionsListContainer />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getAllByTestId("deleteCross")[0]);
    expect(mockOnDelete).toHaveBeenCalledWith("first_id");
  });
});
