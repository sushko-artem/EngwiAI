import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MenuOptions } from "./flash-option-menu";

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("MenuOptions", () => {
  const defaultProps = {
    collectionId: "id-123",
    isMenuOpen: true,
    isReversed: false,
    isVirtual: false,
    onClose: vi.fn(),
    onSwitchChange: vi.fn(),
    onDelete: vi.fn(),
  };

  it("should close when clicking outside", async () => {
    const user = userEvent.setup();
    render(<MenuOptions {...defaultProps} />);

    await user.click(screen.getByTestId("menu-overlay"));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("should navigate to edit page", async () => {
    const user = userEvent.setup();
    render(<MenuOptions {...defaultProps} />);

    await user.click(screen.getByText("Редактировать коллекцию"));

    expect(mockNavigate).toHaveBeenCalledWith("/edit-collection/id-123");
  });

  it("should call onDelete when delete clicked", async () => {
    const user = userEvent.setup();
    render(<MenuOptions {...defaultProps} />);

    await user.click(screen.getByText("Удалить коллекцию"));

    expect(defaultProps.onDelete).toHaveBeenCalled();
  });

  it("should toggle switch", async () => {
    const user = userEvent.setup();
    render(<MenuOptions {...defaultProps} />);

    await user.click(screen.getByRole("switch"));

    expect(defaultProps.onSwitchChange).toHaveBeenCalled();
  });

  it("should show only switch action when collection is virtual", () => {
    defaultProps.isVirtual = true;
    render(<MenuOptions {...defaultProps} />);
    expect(screen.queryByText("Удалить коллекцию")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Редактировать коллекцию"),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });
});
