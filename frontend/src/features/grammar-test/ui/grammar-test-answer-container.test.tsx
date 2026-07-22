import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GrammarTestAnswerContainer } from "./grammar-test-answer-container";
import userEvent from "@testing-library/user-event";

const mockWords = [
  {
    id: "1",
    word: "one",
  },
  {
    id: "2",
    word: "two",
  },
  {
    id: "3",
    word: "three",
  },
];

const defaultProps = {
  words: mockWords,
  borderType: null,
  handleDragEnd: vi.fn(),
  handleAnswer: vi.fn(),
};

describe("GrammarTestAnswerContainer", () => {
  it("should render all words", () => {
    render(<GrammarTestAnswerContainer {...defaultProps} />);
    expect(screen.getByText("one")).toBeInTheDocument();
    expect(screen.getByText("two")).toBeInTheDocument();
    expect(screen.getByText("three")).toBeInTheDocument();
  });

  it("should call handleAnswer on button click", async () => {
    const user = userEvent.setup();
    render(<GrammarTestAnswerContainer {...defaultProps} />);
    await user.click(screen.getByTestId("grammar-test-answer-button"));
    expect(defaultProps.handleAnswer).toBeCalledTimes(1);
  });

  it("should show default border", () => {
    render(<GrammarTestAnswerContainer {...defaultProps} />);
    const container = screen.getByTestId("border-answer");
    expect(container).toHaveClass("border-[#e5e7eb]");
  });

  it("should show green border when answer is correct", () => {
    render(
      <GrammarTestAnswerContainer {...defaultProps} borderType="correct" />,
    );
    expect(screen.getByTestId("border-answer")).toHaveClass("border-green-500");
  });

  it("should show red border when answer is incorrect", () => {
    render(
      <GrammarTestAnswerContainer {...defaultProps} borderType="incorrect" />,
    );
    expect(screen.getByTestId("border-answer")).toHaveClass("border-red-500");
  });
});
