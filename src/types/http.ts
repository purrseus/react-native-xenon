import type { ID, NetworkRequest, NetworkType } from './common';

export interface HttpRequest extends NetworkRequest {
  type: NetworkType.Fetch | NetworkType.XHR;
  method: string;
  requestHeaders?: Record<string, string>;
  requestHeadersString?: string;
  body?: any;
  responseContentType?: string;
  responseSize?: number;
  responseHeaders?: string;
  timeout?: number;
  response?: any;
  responseType?: string;
}

export interface HttpHandlers {
  open: ((id: ID, type: HttpRequest['type'], method: string, url: string) => void) | null;
  requestHeader: ((id: ID, header: string, value: string) => void) | null;
  send: ((id: ID, data?: any) => void) | null;
  headerReceived:
    | ((
        id: ID,
        responseContentType: string | undefined,
        responseSize: number | undefined,
        responseHeaders: string,
      ) => void)
    | null;
  response:
    | ((
        id: ID,
        status: number | undefined,
        timeout: number | undefined,
        duration: number,
        response: any,
        responseURL: string | undefined,
        responseType: string | undefined,
      ) => void)
    | null;
}
