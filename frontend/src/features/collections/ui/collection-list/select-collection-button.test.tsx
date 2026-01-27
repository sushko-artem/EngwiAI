import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { SelectCollectionButton } from "./select-collection-button";

describe("SelectCollectionButton", () => {
  const mockClick = vi.fn();
  const mockDelete = vi.fn();
  const defaultProps = {
    collectionName: "Collection",
    id: "1",
    onClick: mockClick,
    onDelete: mockDelete,
  };

  it("should call onDetete with stopPropagation", async () => {
    const user = userEvent.setup();

    render(<SelectCollectionButton {...defaultProps} />);

    const deleteCross = screen.getByRole("img");

    await user.click(deleteCross);

    expect(mockClick).not.toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalledWith("1");
  });
});
