import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CollectionsButtonsList } from "./collections-buttons-list";
import { useNavigate } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { SelectCollectionButton } from "./select-collection-button";

vi.mock("react-router-dom");
vi.mock("./select-collection-button", () => ({
  SelectCollectionButton: vi.fn(({ collectionName, id, onDelete, onClick }) => (
    <div onClick={() => onClick(id)}>
      <span>{collectionName}</span>
      <button
        data-testid={collectionName}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(id);
        }}
      >
        delete
      </button>
    </div>
  )),
}));

describe("CollectionsButtonsList", () => {
  const mockCollectionsList = [
    {
      name: "FirstCollection",
      id: "first_id",
    },
    {
      name: "SecondCollection",
      id: "second_id",
    },
  ];
  const mockDelete = vi.fn();

  it("should render all collections buttons", () => {
    render(
      <CollectionsButtonsList
        collections={mockCollectionsList}
        onDelete={mockDelete}
      />,
    );

    expect(screen.getByText("FirstCollection")).toBeInTheDocument();
    expect(screen.getByText("SecondCollection")).toBeInTheDocument();
  });

  it("should pass correct props to SelectCollectionButton", () => {
    render(
      <CollectionsButtonsList
        collections={mockCollectionsList}
        onDelete={mockDelete}
      />,
    );

    expect(SelectCollectionButton).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        collectionName: "FirstCollection",
        id: "first_id",
        onDelete: expect.any(Function),
        onClick: expect.any(Function),
      }),
      undefined,
    );

    expect(SelectCollectionButton).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        collectionName: "SecondCollection",
        id: "second_id",
        onDelete: expect.any(Function),
        onClick: expect.any(Function),
      }),
      undefined,
    );
  });

  it("should navigate to '/flash-cards/id' when clicked", async () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    const user = userEvent.setup();

    render(
      <CollectionsButtonsList
        collections={mockCollectionsList}
        onDelete={mockDelete}
      />,
    );

    await user.click(screen.getByText("FirstCollection"));

    expect(mockNavigate).toHaveBeenCalledWith("/flash-cards/first_id");
  });

  it("should call onDelete when delete is clicked", async () => {
    const user = userEvent.setup();

    render(
      <CollectionsButtonsList
        collections={mockCollectionsList}
        onDelete={mockDelete}
      />,
    );

    await user.click(screen.getByTestId("FirstCollection"));

    expect(mockDelete).toHaveBeenCalledWith("first_id");
  });
});
