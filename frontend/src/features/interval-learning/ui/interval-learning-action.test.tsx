import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { IntervalLearningAction } from "./interval-learning-action";
import { VIRTUAL_COLLECTIONS } from "@entities/collection/lib";

const mockNavigate = vi.hoisted(() => vi.fn());
const mockWarning = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@widgets/modal", () => ({
  useModal: () => ({
    warning: mockWarning,
  }),
}));

describe("Interval-learnin-action", () => {
  it("should render block with correct styles & collection length", () => {
    render(
      <IntervalLearningAction
        type={VIRTUAL_COLLECTIONS.ACTIVE}
        collectionLength={3}
      />,
    );
    expect(screen.getByTestId("interval-learning-box")).toHaveClass(
      "border-green-600",
    );
    expect(screen.getByTestId("collection-length")).toHaveTextContent("3");
    expect(screen.getByTestId("collection-length")).toHaveClass(
      "text-green-600",
    );
  });

  it("should navigate to flash-cards page", () => {
    render(
      <IntervalLearningAction
        type={VIRTUAL_COLLECTIONS.ACTIVE}
        collectionLength={3}
      />,
    );
    screen.getByRole("button").click();
    expect(mockNavigate).toHaveBeenCalledWith("/flash-cards/active");
  });

  it("should prevent navigation when collection is empty", () => {
    render(
      <IntervalLearningAction
        type={VIRTUAL_COLLECTIONS.ACTIVE}
        collectionLength={0}
      />,
    );
    screen.getByRole("button").click();
    expect(mockWarning).toHaveBeenCalledWith(
      "В блоке нет ни одной флэш-карты!",
    );
  });
});
