import type { HttpHandlers } from '../types';
import { NetworkInterceptor } from './NetworkInterceptor';

export default abstract class HttpInterceptor extends NetworkInterceptor<HttpHandlers> {
  protected handlers: HttpHandlers = {
    open: null,
    requestHeader: null,
    send: null,
    headerReceived: null,
    response: null,
  };
}
