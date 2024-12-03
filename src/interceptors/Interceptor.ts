export default abstract class Interceptor {
  isInterceptorEnabled = false;

  abstract enableInterception(): void;
  abstract disableInterception(): void;
}
