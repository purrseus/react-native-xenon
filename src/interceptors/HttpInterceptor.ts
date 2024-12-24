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

  protected getCallbacks() {
    const openCallback = this.handlers.open;
    const requestHeaderCallback = this.handlers.requestHeader;
    const sendCallback = this.handlers.send;
    const headerReceivedCallback = this.handlers.headerReceived;
    const responseCallback = this.handlers.response;

    return {
      openCallback,
      requestHeaderCallback,
      sendCallback,
      headerReceivedCallback,
      responseCallback,
    };
  }

  protected clearCallbacks(): void {
    this.handlers.open = null;
    this.handlers.requestHeader = null;
    this.handlers.send = null;
    this.handlers.headerReceived = null;
    this.handlers.response = null;
  }
}
