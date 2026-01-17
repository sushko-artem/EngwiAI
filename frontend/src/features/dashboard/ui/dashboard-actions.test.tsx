import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ActionsDashboard } from "./dashboard-actions";
import { useNavigate } from "react-router-dom";
import { NavigationButton } from "@features/dashboard/ui";

vi.mock("react-router-dom");
vi.mock("@features/dashboard/ui", () => ({
  NavigationButton: vi.fn(({ actions, onClick }) => (
    <div onClick={() => onClick(actions.url)}>
      <span>{actions.title}</span>
    </div>
  )),
}));

describe("ActionsDashboard", () => {
  const mockActions = [
    { title: "Модули", url: "/collections" },
    { title: "Создать модуль", url: "/create-collection" },
  ];

  it("should render all action buttons", () => {
    render(<ActionsDashboard actions={mockActions} />);

    expect(screen.getByText("Модули")).toBeInTheDocument();
    expect(screen.getByText("Создать модуль")).toBeInTheDocument();
  });

  it("NavigationButton should rendered with correct props", () => {
    render(<ActionsDashboard actions={mockActions} />);

    const NavigationButtonMock = vi.mocked(NavigationButton);

    expect(NavigationButtonMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        actions: {
          title: "Модули",
          url: "/collections",
        },
        onClick: expect.any(Function),
      }),
      undefined,
    );

    expect(NavigationButtonMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        actions: {
          title: "Создать модуль",
          url: "/create-collection",
        },
        onClick: expect.any(Function),
      }),
      undefined,
    );
  });

  it("navigates to url when ActionButton is clicked", async () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    const user = userEvent.setup();

    render(<ActionsDashboard actions={mockActions} />);

    await user.click(screen.getByText("Создать модуль"));

    expect(mockNavigate).toHaveBeenCalledWith("/create-collection");
  });
});
