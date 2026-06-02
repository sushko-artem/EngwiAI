type PromiseResolverType = {
  resolve(result: boolean): void;
  timeoutId: ReturnType<typeof setTimeout>;
};

export const MODAL_TIMEOUT = 5 * 60 * 1000;

class ModalPromisesManager {
  private promises = new Map<string, PromiseResolverType>();
  private defaultTimeout: number;

  constructor(defaultTimeout = MODAL_TIMEOUT) {
    this.defaultTimeout = defaultTimeout;
  }

  create(
    modalId: string,
    timeoutMs?: number,
    onTimeout?: () => void,
  ): Promise<boolean> {
    if (this.promises.has(modalId)) {
      throw new Error(`Promise for ${modalId} already exists`);
    }
    return new Promise<boolean>((resolve) => {
      const timeout = timeoutMs ?? this.defaultTimeout;
      const timeoutId = setTimeout(() => {
        resolve(false);
        this.promises.delete(modalId);
        onTimeout?.();
      }, timeout);
      this.promises.set(modalId, { resolve, timeoutId });
    });
  }

  action(modalId: string, result: boolean) {
    const resolver = this.promises.get(modalId);
    if (!resolver) return false;
    clearTimeout(resolver.timeoutId);
    resolver.resolve(result);
    this.promises.delete(modalId);
    return true;
  }

  get size() {
    return this.promises.size;
  }

  destroy() {
    this.promises.forEach((resolver) => {
      clearTimeout(resolver.timeoutId);
      resolver.resolve(false);
    });
    this.promises.clear();
  }
}

export const modalPromises = new ModalPromisesManager();
