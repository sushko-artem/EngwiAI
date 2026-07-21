import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  RATE_LIMIT_KEY,
  RATE_LIMIT_TIME_KEY,
  StartTestButtonContainer,
} from "./start-test-button-container";

const mockHandleClick = vi.hoisted(() => vi.fn());

describe("StartTestButtonContainer", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("should call handleClick and set sessionStorage on click", async () => {
    render(<StartTestButtonContainer handleClick={mockHandleClick} />);
    fireEvent.click(screen.getByTestId("start-test"));
    expect(mockHandleClick).toHaveBeenCalled();
    expect(sessionStorage.getItem(RATE_LIMIT_KEY)).toBe("true");
    expect(sessionStorage.getItem(RATE_LIMIT_TIME_KEY)).toBeTruthy();
  });

  it("should disable button after click", () => {
    render(<StartTestButtonContainer handleClick={mockHandleClick} />);
    fireEvent.click(screen.getByTestId("start-test"));
    expect(screen.getByTestId("start-test")).toBeDisabled();
    expect(screen.getByTestId("rate-limit-timer")).toBeInTheDocument();
  });

  it("should restore disabled state from sessionStorage", () => {
    sessionStorage.setItem(RATE_LIMIT_KEY, "true");
    sessionStorage.setItem(RATE_LIMIT_TIME_KEY, String(Date.now() - 5000));
    render(<StartTestButtonContainer handleClick={mockHandleClick} />);
    expect(screen.getByTestId("start-test")).toBeDisabled();
    expect(screen.getByText("Следующая попытка через 55 сек."));
  });

  it("should countdown and re-enable button", () => {
    vi.useFakeTimers();
    render(<StartTestButtonContainer handleClick={mockHandleClick} />);
    fireEvent.click(screen.getByTestId("start-test"));
    expect(screen.getByTestId("start-test")).toBeDisabled();
    act(() => {
      vi.advanceTimersByTime(59000);
    });
    expect(screen.getByText("Следующая попытка через 1 сек."));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId("start-test")).toBeEnabled();
    vi.useRealTimers();
  });
});
