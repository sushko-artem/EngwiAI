/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ModalRootContainer } from "./modal-root-container";
import { closeModal, cancel, confirm } from "@entities/modal/model";

const createModalState = (overrides = {}) => ({
  isOpen: false,
  mode: "CLOSED",
  message: "",
  ...overrides,
});

const mockDispatch = vi.hoisted(() => vi.fn());
const mockSelector = vi.hoisted(() => vi.fn());
const mockPortal = vi.hoisted(() => vi.fn());

vi.mock("react-dom", () => ({
  createPortal: (children: React.ReactNode, container: Element) => {
    mockPortal(children, container);
    return children;
  },
}));

vi.mock("@redux/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: mockSelector,
}));

vi.mock("@assets/images/cross.webp", () => ({
  default: (props: any) => <img {...props} alt="close" />,
}));

vi.mock("@assets/images/modalConfirm.png", () => ({
  default: (props: any) => <img {...props} alt="confirm" />,
}));

describe("ModalRootContainer", () => {
  let modalContainer: HTMLDivElement;

  beforeEach(() => {
    modalContainer = document.createElement("div");
    modalContainer.id = "modal";
    document.body.appendChild(modalContainer);
  });

  afterEach(() => {
    document.body.removeChild(modalContainer);
  });

  it("should not render Modal when state.isOpen = false", () => {
    vi.mocked(mockSelector).mockReturnValueOnce(createModalState());

    const { container } = render(<ModalRootContainer />);

    expect(container).toBeEmptyDOMElement();
    expect(mockPortal).not.toHaveBeenCalled();
    expect(container.firstChild).toBeNull();
  });

  it("should render Modal in portal when state.isOpen = true", () => {
    vi.mocked(mockSelector).mockReturnValueOnce(
      createModalState({ isOpen: true, message: "Warning message" }),
    );

    render(<ModalRootContainer />);

    expect(mockPortal).toHaveBeenCalledTimes(1);
    expect(mockPortal).toHaveBeenCalledWith(expect.anything(), modalContainer);
    expect(screen.getByText("Warning message")).toBeInTheDocument();
  });

  it("shoul dispatch closeModal when mode = WARN and clicking close button", () => {
    vi.mocked(mockSelector).mockReturnValueOnce(
      createModalState({
        isOpen: true,
        mode: "WARN",
      }),
    );

    render(<ModalRootContainer />);

    fireEvent.click(screen.getByAltText("close").closest("div")!);

    expect(mockDispatch).toHaveBeenCalledWith(closeModal());
  });

  it("shoul dispatch confirm when mode = CONFIRM and clicking confirm button", () => {
    vi.mocked(mockSelector).mockReturnValueOnce(
      createModalState({
        isOpen: true,
        mode: "CONFIRM",
      }),
    );

    render(<ModalRootContainer />);

    fireEvent.click(screen.getByAltText("confirm").closest("div")!);

    expect(mockDispatch).toHaveBeenCalledWith(confirm());
  });

  it("shoul dispatch cancel when mode = CONFIRM and clicking cancel button", () => {
    vi.mocked(mockSelector).mockReturnValueOnce(
      createModalState({
        isOpen: true,
        mode: "CONFIRM",
      }),
    );

    render(<ModalRootContainer />);

    fireEvent.click(screen.getByAltText("close").closest("div")!);

    expect(mockDispatch).toHaveBeenCalledWith(cancel());
  });
});
