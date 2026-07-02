import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SpellTestMainContent } from "./spell-test-main-content";
import type { SideValueType } from "@widgets/choose-collection";
import userEvent from "@testing-library/user-event";

const collection = [
  { id: "1", word: "Green", translation: "Зеленый" },
  { id: "2", word: "Black", translation: "Черный" },
];

describe("spell-test-main-content", () => {
  const defaultProps = {
    collection,
    index: 0,
    onAnswer: vi.fn(),
    visibleSide: "word" as SideValueType,
    inProgress: true,
    borderType: null,
  };

  it("should render correct card side initially", () => {
    render(<SpellTestMainContent {...defaultProps} />);
    expect(screen.getByText("Green")).toBeInTheDocument();
  });

  it("should call onAnswer function with correct data when clicking on answer button", async () => {
    const user = userEvent.setup();
    render(<SpellTestMainContent {...defaultProps} />);
    const textArea = screen.getByTestId("user-answer-textarea");
    await user.type(textArea, "Зеленый");
    await user.click(screen.getByTestId("spell-test-answer-button"));
    expect(defaultProps.onAnswer).toHaveBeenCalledWith("Зеленый", "Зеленый");
  });

  it("should call onAnswer when clicking Enter", async () => {
    const user = userEvent.setup();
    render(<SpellTestMainContent {...defaultProps} />);
    const textArea = screen.getByTestId("user-answer-textarea");
    await user.type(textArea, "Зеленый");
    await user.keyboard("{Enter}");
    expect(defaultProps.onAnswer).toHaveBeenCalledWith("Зеленый", "Зеленый");
  });

  it("should show correct border for incorrect answer", async () => {
    const props = { ...defaultProps, borderType: "incorrect" as const };

    render(<SpellTestMainContent {...props} />);

    const textarea = screen.getByTestId("user-answer-textarea");
    expect(textarea).toHaveClass("border-red-500");
  });
});
