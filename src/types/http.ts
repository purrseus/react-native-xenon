import type { ID, NetworkRecord, NetworkType } from './common';

export interface HttpRecord extends NetworkRecord {
  type: NetworkType.Fetch | NetworkType.XHR;
  method: string;
  url: string;
  requestHeaders?: string;
  body?: any;
  responseContentType?: string;
  responseSize?: number;
  responseHeaders?: string;
  timeout?: number;
  response?: any;
  responseType?: string;
}

export type HttpOpenCallback =
  | ((id: ID, type: HttpRecord['type'], method: string, url: string) => void)
  | null;

export type HttpRequestHeaderCallback = ((id: ID, header: string, value: string) => void) | null;

export type HttpSendCallback = ((id: ID, data?: any) => void) | null;

export type HttpHeaderReceivedCallback =
  | ((
      id: ID,
      responseContentType: string | undefined,
      responseSize: number | undefined,
      responseHeaders: string,
    ) => void)
  | null;

export type HttpResponseCallback =
  | ((
      id: ID,
      status: number | undefined,
      timeout: number | undefined,
      response: any,
      responseURL: string | undefined,
      responseType: string | undefined,
    ) => void)
  | null;
