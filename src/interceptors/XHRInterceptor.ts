import { NetworkType } from '../types';
import { getHttpInterceptorId } from '../utils';
import HttpInterceptor from './HttpInterceptor';

const originalXHROpen = XMLHttpRequest.prototype.open;
const originalXHRSend = XMLHttpRequest.prototype.send;
const originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

export default class XHRInterceptor extends HttpInterceptor {
  static instance = new XHRInterceptor();

  private constructor() {
    super();
  }

  enableInterception() {
    if (this.isInterceptorEnabled) return;

    const {
      openCallback,
      requestHeaderCallback,
      sendCallback,
      headerReceivedCallback,
      responseCallback,
    } = this.getCallbacks();

    const isInterceptorEnabled = () => this.isInterceptorEnabled;

    XMLHttpRequest.prototype.open = function (method, url) {
      this._interceptionId = getHttpInterceptorId();

      openCallback?.(this._interceptionId, NetworkType.XHR, method, url);

      originalXHROpen.apply(this, arguments as unknown as Parameters<typeof originalXHROpen>);
    };

    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
      requestHeaderCallback?.(this._interceptionId, header, value);

      originalXHRSetRequestHeader.apply(
        this,
        arguments as unknown as Parameters<typeof originalXHRSetRequestHeader>,
      );
    };

    XMLHttpRequest.prototype.send = function (data) {
      sendCallback?.(this._interceptionId, data);

      this.addEventListener?.('readystatechange', () => {
        if (!isInterceptorEnabled()) return;

        if (this.readyState === this.HEADERS_RECEIVED) {
          const contentTypeString = this.getResponseHeader('Content-Type');
          const contentLengthString = this.getResponseHeader('Content-Length');

          let responseContentType: string | undefined;
          let responseSize: number | undefined;

          if (contentTypeString) responseContentType = contentTypeString.split(';')[0];

          if (contentLengthString) responseSize = parseInt(contentLengthString, 10);

          headerReceivedCallback?.(
            this._interceptionId,
            responseContentType,
            responseSize,
            this.getAllResponseHeaders(),
          );
        }

        if (this.readyState === this.DONE) {
          responseCallback?.(
            this._interceptionId,
            this.status,
            this.timeout,
            this.response,
            this.responseURL,
            this.responseType,
          );
        }
      });

      originalXHRSend.apply(this, arguments as unknown as Parameters<typeof originalXHRSend>);
    };

    this.isInterceptorEnabled = true;
  }

  disableInterception() {
    if (!this.isInterceptorEnabled) return;

    this.isInterceptorEnabled = false;

    XMLHttpRequest.prototype.send = originalXHRSend;
    XMLHttpRequest.prototype.open = originalXHROpen;
    XMLHttpRequest.prototype.setRequestHeader = originalXHRSetRequestHeader;

    this.clearCallbacks();
  }
}
