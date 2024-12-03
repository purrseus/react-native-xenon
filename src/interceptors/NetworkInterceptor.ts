import Interceptor from './Interceptor';

export abstract class NetworkInterceptor extends Interceptor {
  protected abstract getCallbacks(): any;
  protected abstract clearCallbacks(): void;
}
