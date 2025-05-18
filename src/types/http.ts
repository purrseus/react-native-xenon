import type { ID, NetworkRequest, NetworkType } from './common';

export interface HttpRequest extends NetworkRequest {
  type: NetworkType.Fetch | NetworkType.XHR;
  method: string;
  requestHeaders?: Map<string, string>;
  body?: any;
  responseContentType?: string;
  responseSize?: number;
  responseHeaders?: Map<string, string>;
  timeout?: number;
  response?: any;
  responseType?: string;
}

export interface HttpHandlers {
  open: ((id: ID, type: HttpRequest['type'], method: string, url: string) => void) | null;
  requestHeader: ((id: ID, header: string, value: string) => void) | null;
  send: ((id: ID, startTime: number, data?: any) => void) | null;
  headerReceived:
    | ((
        id: ID,
        responseContentType: string | undefined,
        responseSize: number | undefined,
        responseHeaders: HttpRequest['responseHeaders'],
      ) => void)
    | null;
  response:
    | ((
        id: ID,
        status: number | undefined,
        timeout: number | undefined,
        endTime: number,
        response: any,
        responseURL: string | undefined,
        responseType: string | undefined,
      ) => void)
    | null;
}
