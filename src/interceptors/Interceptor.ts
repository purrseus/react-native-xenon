export default abstract class Interceptor<T extends Object> {
  #isInterceptorEnabled = false;

  get isInterceptorEnabled() {
    return this.#isInterceptorEnabled;
  }

  protected set isInterceptorEnabled(value: boolean) {
    this.#isInterceptorEnabled = value;
  }

  protected abstract handlers: T;

  set(key: keyof T, value: T[keyof T]): this {
    if (key in this.handlers) this.handlers[key] = value;
    return this;
  }

  abstract enableInterception(): void;
  abstract disableInterception(): void;
}
