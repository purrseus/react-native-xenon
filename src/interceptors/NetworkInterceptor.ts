import Interceptor from './Interceptor';

type Callbacks<T> = { [K in keyof T as `${string & K}Callback`]: T[K] };

export abstract class NetworkInterceptor<T extends Object> extends Interceptor<T> {
  protected getCallbacks(): Callbacks<T> {
    const callbacks = {} as Callbacks<T>;

    for (const key in this.handlers) {
      (callbacks as any)[`${key}Callback`] = this.handlers[key as keyof T];
    }

    return callbacks;
  }

  protected clearCallbacks(): void {
    for (const key in this.handlers) {
      (this.handlers as any)[key] = null;
    }
  }
}
