import Interceptor from './Interceptor';

export abstract class NetworkInterceptor<T extends Object> extends Interceptor<T> {
  protected abstract getCallbacks(): any;
  protected abstract clearCallbacks(): void;
}
