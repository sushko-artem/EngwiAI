import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { IntervalLearningContainer } from "./interval-learning-container";
import { useIntervalLearning } from "../lib";

vi.mock("../lib", () => ({
  useIntervalLearning: vi.fn(),
}));

vi.mock("@widgets/modal", () => ({
  useModal: () => ({
    warning: vi.fn(),
  }),
}));

const headerProps = {
  title: "Title",
  leftIcon: "backArrow",
  leftIconTitle: "IconTitle",
  leftIconAction: vi.fn(),
};

describe("IntervalLearningContainer", () => {
  it("should render correctly", () => {
    vi.mocked(useIntervalLearning).mockReturnValue({
      isLoading: false,
      isRefetching: false,
      activeLength: 17,
      inactiveLength: 31,
      headerProps,
    });
    render(
      <MemoryRouter>
        <IntervalLearningContainer />
      </MemoryRouter>,
    );
    expect(screen.getByText("17")).toBeInTheDocument();
    expect(screen.getByText("31")).toBeInTheDocument();
  });

  it("should show Loader when loading", () => {
    vi.mocked(useIntervalLearning).mockReturnValue({
      isLoading: true,
      isRefetching: false,
      activeLength: 2,
      inactiveLength: 3,
      headerProps,
    });
    render(
      <MemoryRouter>
        <IntervalLearningContainer />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("should show 'Not a single collection' when empty collections", () => {
    vi.mocked(useIntervalLearning).mockReturnValue({
      isLoading: false,
      isRefetching: false,
      activeLength: 0,
      inactiveLength: 0,
      headerProps,
    });
    render(
      <MemoryRouter>
        <IntervalLearningContainer />
      </MemoryRouter>,
    );
    expect(
      screen.getByText("Ни одного модуля пока не создано!"),
    ).toBeInTheDocument();
  });

  it("should change opacity style when refetching", () => {
    vi.mocked(useIntervalLearning).mockReturnValue({
      isLoading: false,
      isRefetching: true,
      activeLength: 22,
      inactiveLength: 37,
      headerProps,
    });
    render(
      <MemoryRouter>
        <IntervalLearningContainer />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("interval-opacity")).toHaveClass("opacity-10");
  });
});
