/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from "vitest";
import {
  modalMiddleware,
  modalPromises,
  MODAL_TIMEOUT,
} from "./modalMiddleware";
import {
  confirmModalAction,
  openModalWithPromise,
  cancelModalAction,
} from "../actions";
import { closeModal, openModal } from "@entities/modal/model";

vi.mock("@reduxjs/toolkit", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@reduxjs/toolkit")>();
  return {
    ...actual,
    nanoid: () => "test-modal-id-123",
  };
});

describe("ModalMiddleware", () => {
  let mockStore: any;
  let mockNext: Mock;
  let mockMiddleware: any;

  beforeEach(() => {
    modalPromises.clear();
    mockStore = {
      getState: vi.fn(() => ({ modal: { modalId: null } })),
      dispatch: vi.fn(),
    };

    mockNext = vi.fn();

    mockMiddleware = modalMiddleware(mockStore)(mockNext);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return Promise when call openModalWithPromise", () => {
    const action = openModalWithPromise("CONFIRM", "Are you sure?");

    const result = mockMiddleware(action);

    expect(result).toBeInstanceOf(Promise);

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      openModal({
        mode: "CONFIRM",
        message: "Are you sure?",
        modalId: "test-modal-id-123",
      }),
    );

    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should resolve promise whith true when confirmModalAction is dispatched", async () => {
    mockStore.getState.mockReturnValue({
      modal: { modalId: "test-modal-id-123" },
    });

    const action = openModalWithPromise("CONFIRM", "Are you sure?");

    const promise = mockMiddleware(action);

    expect(modalPromises.size).toBe(1);

    mockMiddleware(confirmModalAction());

    const result = await promise;

    expect(result).toBe(true);

    expect(mockStore.dispatch).toHaveBeenCalledWith(closeModal());

    expect(modalPromises.size).toBe(0);

    expect(vi.getTimerCount()).toBe(0);
  });

  it("should resolve promise whith false when cancelModalAction is dispatched", async () => {
    mockStore.getState.mockReturnValue({
      modal: { modalId: "test-modal-id-123" },
    });

    const action = openModalWithPromise("CONFIRM", "Are you sure?");

    const promise = mockMiddleware(action);

    expect(modalPromises.size).toBe(1);

    mockMiddleware(cancelModalAction());

    const result = await promise;

    expect(result).toBe(false);

    expect(mockStore.dispatch).toHaveBeenCalledWith(closeModal());

    expect(modalPromises.size).toBe(0);

    expect(vi.getTimerCount()).toBe(0);
  });

  it("should auto-resolve promise with false after timeout", async () => {
    const openAction = openModalWithPromise("CONFIRM", "Are you sure?");

    const promise = mockMiddleware(openAction);

    vi.advanceTimersByTime(MODAL_TIMEOUT + 1000);

    const result = await promise;

    expect(result).toBe(false);
    expect(modalPromises.size).toBe(0);
    expect(mockStore.dispatch).toHaveBeenCalledWith(closeModal());
  });

  it("should clear timeout when modal is confirmed", async () => {
    mockStore.getState.mockReturnValue({
      modal: { modalId: "test-modal-id-123" },
    });

    const openAction = openModalWithPromise("CONFIRM", "Are you sure?");

    const promise = mockMiddleware(openAction);

    expect(vi.getTimerCount()).toBe(1);

    mockMiddleware(confirmModalAction());

    expect(vi.getTimerCount()).toBe(0);

    const result = await promise;
    expect(result).toBe(true);
  });

  it("should pass through other actions", () => {
    const otherAction = { type: "action/otherAction" };

    mockMiddleware(otherAction);

    expect(mockNext).toHaveBeenCalledWith(otherAction);
    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });
});
