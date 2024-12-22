export default abstract class Interceptor {
  #isInterceptorEnabled = false;

  get isInterceptorEnabled() {
    return this.#isInterceptorEnabled;
  }

  protected set isInterceptorEnabled(value: boolean) {
    this.#isInterceptorEnabled = value;
  }

  abstract enableInterception(): void;
  abstract disableInterception(): void;
}
