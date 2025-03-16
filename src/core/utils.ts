import { URL } from 'react-native-url-polyfill';
import { NetworkType, type HttpRequest, type LogMessage, type WebSocketRequest } from '../types';
import colors from '../theme/colors';

export const getNetworkUtils = (data: HttpRequest | WebSocketRequest) => {
  const isHttp = data?.type !== NetworkType.WS;
  const requestUrl = new URL(data.url);

  const overviewShown = !!data.url;
  const httpHeadersShown = isHttp && (!!data.requestHeaders?.size || !!data.responseHeaders?.size);
  const websocketHeadersShown = !isHttp && !!Object.keys(data.options?.headers ?? {}).length;
  const headersShown = httpHeadersShown || websocketHeadersShown;
  const requestShown = isHttp && (!!requestUrl.search || !!data.body);
  const responseShown = isHttp && !!data.response;
  const messagesShown = !isHttp && !!data.messages;

  return {
    isHttp,
    requestUrl,
    overviewShown,
    headersShown,
    requestShown,
    responseShown,
    messagesShown,
  };
};

const hexToHexAlpha = (hex: string, opacity: number) =>
  `${hex}${`${(Math.min(Math.max(opacity, 0), 1) * 255).toString(16)}0`.slice(0, 2)}`;

export const getConsoleTypeColor = (type: LogMessage['type']) => {
  let color: string;
  switch (type) {
    case 'log':
      color = colors.white;
      break;
    case 'info':
      color = colors.blue;
      break;
    case 'warn':
    case 'debug':
    case 'trace':
      color = colors.yellow;
      break;
    case 'error':
      color = colors.red;
      break;
    default:
      color = colors.white;
  }

  return hexToHexAlpha(color, 0.25);
};

//#region metrics
export const getVerticalSafeMargin = (screenHeight: number) => screenHeight / 8;

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const getHttpInterceptorId = () => {
  const timestamp = Date.now().toString(36);
  const randomNum = Math.random().toString(36).substring(2, 10);
  return timestamp + randomNum;
};
//#endregion

//#region formatters
const limitChar = (value: any, limit = 5000) => {
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value ?? '');

  return stringValue.length > limit
    ? `${stringValue.slice(0, limit)}\n---LIMITED TO ${limit} CHARACTERS---`
    : stringValue;
};

export const keyValueToString = (
  key: string,
  value: any,
  newLine: 'leading' | 'trailing' | null = 'trailing',
): string =>
  `${newLine === 'leading' ? '\n' : ''}${key}: ${limitChar(value)}${newLine === 'trailing' ? '\n' : ''}`;

export const formatRequestMethod = (method?: string) => method ?? 'GET';

export const formatRequestDuration = (startTime?: number, endTime?: number) => {
  if (typeof startTime !== 'number' || typeof endTime !== 'number') return 'pending';
  return `${endTime - startTime}ms`;
};

export const formatRequestStatusCode = (statusCode?: number) => `${statusCode ?? 'pending'}`;

export const formatLogMessage = (values: any[]) => {
  return values.reduce((pre, cur, index) => pre + (!index ? '' : ', ') + limitChar(cur), '');
};

export const beautify = (data: any, beautified: boolean) => {
  if (!data) return '';

  try {
    const res = typeof data === 'string' ? JSON.parse(data) : data;
    return beautified ? JSON.stringify(res, null, 4) : limitChar(res);
  } catch (error) {
    return limitChar(data);
  }
};

export const convertToCurl = (
  method: HttpRequest['method'],
  url: HttpRequest['url'],
  headers: HttpRequest['requestHeaders'],
  body: HttpRequest['body'],
) => {
  let curlCommand = `curl -X ${method.toUpperCase()} "${url}"`;

  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      curlCommand += ` -H "${key}: ${value}"`;
    }
  }

  if (body) {
    const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
    curlCommand += ` -d '${bodyString}'`;
  }

  return curlCommand;
};
//#endregion

//#region decorators
export function frozen(_target: Object) {
  const descriptor: PropertyDescriptor = arguments[2];
  descriptor.configurable = false;
  descriptor.writable = false;
}

export function singleton<T extends { new (...args: any[]): {} }>(constructor: T) {
  class Singleton extends constructor {
    static #instance: Singleton;

    constructor(...args: any[]) {
      if (Singleton.#instance) return Singleton.#instance;

      super(...args);
      Singleton.#instance = this;
    }
  }

  return Singleton;
}
//#endregion
