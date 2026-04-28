import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ModalFlash } from "./flash-cards-modal";
import userEvent from "@testing-library/user-event";

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("ModalFlash", () => {
  const defaultProps = {
    collectionId: "id-123",
    moduleName: "test",
    moduleLength: 5,
    unknownTerms: 2,
    isVirtual: false,
    reset: vi.fn(),
    updateStatus: vi.fn(),
  };

  const user = userEvent.setup();

  it("should render correct summary", () => {
    render(<ModalFlash {...defaultProps} />);

    expect(screen.getByRole("heading")).toHaveTextContent(
      'Модуль "test" пройден!',
    );
    expect(screen.getByText("Знаю: 3")).toBeInTheDocument();
    expect(screen.getByText("Изучил: 2")).toBeInTheDocument();
    expect(screen.getByText("Прогресс: 60%")).toBeInTheDocument();
  });

  it("should call reset when clicking reset", async () => {
    render(<ModalFlash {...defaultProps} />);

    await user.click(screen.getByText("Пройти заново"));

    expect(defaultProps.reset).toHaveBeenCalled();
  });

  it("should navigate to '/edit-collection' when clicking editCollection", async () => {
    render(<ModalFlash {...defaultProps} />);

    await user.click(screen.getByText("Редактировать"));

    expect(mockNavigate).toHaveBeenCalledWith("/edit-collection/id-123");
  });

  it("should navigate to '/collections' page and update cards status", async () => {
    render(<ModalFlash {...defaultProps} />);

    await user.click(screen.getByText("Выбрать другой"));
    expect(defaultProps.updateStatus).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/collections");
  });

  it("should render correct summary actions fields when collection is virtual", () => {
    defaultProps.isVirtual = true;
    render(<ModalFlash {...defaultProps} />);

    expect(screen.queryByText("Редактировать")).not.toBeInTheDocument();
    expect(screen.getByText("Пройти заново")).toBeInTheDocument();
    expect(screen.getByText("Завершить")).toBeInTheDocument();
  });

  it("should navigate to '/dashboard' page and update cards status when complete module and collectioin is Virtual", async () => {
    defaultProps.isVirtual = true;
    render(<ModalFlash {...defaultProps} />);
    await user.click(screen.getByText("Завершить"));
    expect(defaultProps.updateStatus).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
