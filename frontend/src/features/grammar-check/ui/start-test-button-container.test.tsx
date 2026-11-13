import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StartTestButtonContainer } from "./start-test-button-container";

const mockHandleClick = vi.hoisted(() => vi.fn());
const mockRateLimit = vi.hoisted(() => ({
  isBlocked: vi.fn(),
  getSecondsLeft: vi.fn(),
  clear: vi.fn(),
  duration: 60,
}));

vi.mock("@shared/lib", () => ({
  rateLimit: mockRateLimit,
}));

describe("StartTestButtonContainer", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("should call handleClick on click", async () => {
    mockRateLimit.isBlocked.mockReturnValue(false);
    render(<StartTestButtonContainer handleClick={mockHandleClick} />);
    fireEvent.click(screen.getByTestId("start-test"));
    expect(mockHandleClick).toHaveBeenCalled();
  });

  it("should render enabled", () => {
    mockRateLimit.isBlocked.mockReturnValue(false);
    render(<StartTestButtonContainer handleClick={mockHandleClick} />);
    expect(screen.getByTestId("start-test")).toBeEnabled();
    expect(screen.queryByText("Следующая попытка")).not.toBeInTheDocument();
  });

  it("should render disabled", () => {
    mockRateLimit.isBlocked.mockReturnValue(true);
    mockRateLimit.getSecondsLeft.mockReturnValue(22);
    render(<StartTestButtonContainer handleClick={mockHandleClick} />);
    expect(screen.getByTestId("start-test")).toBeDisabled();
    expect(
      screen.getByText("Следующая попытка через 22 сек."),
    ).toBeInTheDocument();
  });

  it("should countdown and re-enable button", () => {
    mockRateLimit.isBlocked.mockReturnValue(true);
    mockRateLimit.getSecondsLeft.mockReturnValue(22);
    vi.useFakeTimers();
    render(<StartTestButtonContainer handleClick={mockHandleClick} />);
    act(() => {
      vi.advanceTimersByTime(21000);
    });
    expect(
      screen.getByText("Следующая попытка через 1 сек."),
    ).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId("start-test")).toBeEnabled();
    vi.useRealTimers();
  });
});
