import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EditableCard } from "./editable-card";
import { deleteCard, updateCard } from "@features/collections/model";
import userEvent from "@testing-library/user-event";

const mockDistpatch = vi.hoisted(() => vi.fn());

vi.mock("@redux/hooks", () => ({
  useAppDispatch: () => mockDistpatch,
}));

describe("EditableCard", () => {
  const card = {
    id: "card-id",
    word: "hello",
    translation: "привет",
  };

  it("should render with correct input values", () => {
    render(<EditableCard {...card} />);

    expect(screen.getByDisplayValue("hello")).toBeInTheDocument();
    expect(screen.getByDisplayValue("привет")).toBeInTheDocument();
  });

  it("should dispatch deleteCard() on deleting", async () => {
    const user = userEvent.setup();

    render(<EditableCard {...card} />);

    const deleteButton = screen.getByRole("img");

    await user.click(deleteButton);

    expect(mockDistpatch).toHaveBeenCalledWith(deleteCard("card-id"));
  });

  it("should dispatch updateCard() when word changes", async () => {
    render(<EditableCard {...card} />);

    const inputField = screen.getByDisplayValue("hello");

    fireEvent.change(inputField, { target: { value: "dog" } });

    expect(mockDistpatch).toHaveBeenCalledWith(
      updateCard({ id: "card-id", value: "dog", field: "word" }),
    );
  });

  it("should dispatch updateCard() when translation changes", async () => {
    render(<EditableCard {...card} />);

    const inputField = screen.getByDisplayValue("привет");

    fireEvent.change(inputField, { target: { value: "собака" } });

    expect(mockDistpatch).toHaveBeenCalledWith(
      updateCard({ id: "card-id", value: "собака", field: "translation" }),
    );
  });
});
