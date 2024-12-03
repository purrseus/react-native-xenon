import { NETWORK_INSPECTOR_REQUEST_HEADER } from '../constants';
import { NetworkType } from '../types';
import { createHttpHeaderLine, formatMethod, getHttpInterceptorId } from '../utils';
import HttpInterceptor from './HttpInterceptor';

const originalFetch = global.fetch;

export default class FetchInterceptor extends HttpInterceptor {
  static instance = new FetchInterceptor();

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

    global.fetch = async function (input, init) {
      const interceptionId = getHttpInterceptorId();

      const requestHeaders = new Headers(init?.headers);

      requestHeaders.append(NETWORK_INSPECTOR_REQUEST_HEADER, NetworkType.Fetch);

      const requestInit: RequestInit = { ...init, headers: requestHeaders };

      //#region open
      const method = formatMethod(init?.method);

      let url: string;

      switch (true) {
        case input instanceof Request:
          url = input.url;
          break;
        case input instanceof URL:
          url = input.href;
          break;
        default:
          url = input;
      }

      openCallback?.(interceptionId, NetworkType.Fetch, method, url);
      //#endregion

      //#region requestHeader
      const headers = requestInit?.headers;
      if (headers) {
        switch (true) {
          case headers instanceof Headers:
            for (const [headerKey, headerValue] of headers.entries()) {
              requestHeaderCallback?.(interceptionId, headerKey, headerValue);
            }
            break;
          case Array.isArray(headers):
            for (const [headerKey, headerValue] of headers) {
              if (headerKey && headerValue)
                requestHeaderCallback?.(interceptionId, headerKey, headerValue);
            }
            break;
          default:
            for (const key in headers) {
              if (headers[key]) requestHeaderCallback?.(interceptionId, key, headers[key]);
            }
            break;
        }
      }
      //#endregion

      //#region send
      sendCallback?.(interceptionId, init?.body ?? null);
      //#endregion

      const response = await originalFetch.call(this, input, requestInit);

      const clonedResponse = response.clone();
      const clonedResponseHeaders = clonedResponse.headers;

      //#region headerReceived
      const contentTypeString = clonedResponseHeaders.get('Content-Type');
      const contentLengthString = clonedResponseHeaders.get('Content-Length');

      let responseContentType: string | undefined;
      let responseSize: number | undefined;
      let responseHeaders: string = '';

      if (contentTypeString) responseContentType = contentTypeString.split(';')[0];

      if (contentLengthString) responseSize = parseInt(contentLengthString, 10);

      for (const [headerKey, headerValue] of clonedResponseHeaders.entries()) {
        responseHeaders += createHttpHeaderLine(headerKey, headerValue);
      }

      headerReceivedCallback?.(interceptionId, responseContentType, responseSize, responseHeaders);
      //#endregion

      //#region response
      const responseBody: string | null = await clonedResponse.text().catch(() => null);

      responseCallback?.(
        interceptionId,
        clonedResponse.status,
        0,
        responseBody,
        clonedResponse.url,
        clonedResponse.type,
      );
      //#endregion

      return response;
    };

    this.isInterceptorEnabled = true;
  }

  disableInterception() {
    if (!this.isInterceptorEnabled) return;

    this.isInterceptorEnabled = false;

    global.fetch = originalFetch;

    this.clearCallbacks();
  }
}
