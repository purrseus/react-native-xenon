import { frozen, getHttpInterceptorId, singleton } from '../core/utils';
import { NetworkType } from '../types';
import HttpInterceptor from './HttpInterceptor';

const originalXHROpen = XMLHttpRequest.prototype.open;
const originalXHRSend = XMLHttpRequest.prototype.send;
const originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

@singleton
export default class XHRInterceptor extends HttpInterceptor {
  @frozen
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

    XMLHttpRequest.prototype.open = function (method, url, ...args) {
      this._interceptionId = getHttpInterceptorId();

      openCallback?.(this._interceptionId, NetworkType.XHR, method, url);

      originalXHROpen.call(this, method, url, ...args);
    };

    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
      requestHeaderCallback?.(this._interceptionId, header, value);

      originalXHRSetRequestHeader.call(this, header, value);
    };

    XMLHttpRequest.prototype.send = function (data) {
      sendCallback?.(this._interceptionId, Date.now(), data);

      this.addEventListener?.('readystatechange', () => {
        if (!isInterceptorEnabled()) return;

        if (this.readyState === this.HEADERS_RECEIVED) {
          const contentTypeString = this.getResponseHeader('Content-Type');
          const contentLengthString = this.getResponseHeader('Content-Length');

          const responseContentType = contentTypeString
            ? contentTypeString.split(';')[0]
            : undefined;

          const responseSize = contentLengthString ? parseInt(contentLengthString, 10) : undefined;

          const responseHeadersArray = this.getAllResponseHeaders().split('\n');
          const responseHeaders = responseHeadersArray.reduce<Map<string, string>>(
            (acc, header) => {
              const [key, value] = header.split(': ');
              if (key && value) acc.set(key, value);
              return acc;
            },
            new Map(),
          );

          headerReceivedCallback?.(
            this._interceptionId,
            responseContentType,
            responseSize,
            responseHeaders,
          );
        }

        if (this.readyState === this.DONE) {
          responseCallback?.(
            this._interceptionId,
            this.status,
            this.timeout,
            Date.now(),
            this.response,
            this.responseURL,
            this.responseType,
          );
        }
      });

      originalXHRSend.call(this, data);
    };

    this.isInterceptorEnabled = true;
  }

  @frozen
  disableInterception() {
    if (!this.isInterceptorEnabled) return;

    this.isInterceptorEnabled = false;

    XMLHttpRequest.prototype.send = originalXHRSend;
    XMLHttpRequest.prototype.open = originalXHROpen;
    XMLHttpRequest.prototype.setRequestHeader = originalXHRSetRequestHeader;

    this.clearCallbacks();
  }
}
