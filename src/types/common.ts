import type { HttpRequest, LogMessage, WebSocketRequest } from '.';

export enum NetworkType {
  XHR = 'xhr',
  Fetch = 'fetch',
  WS = 'ws',
}

export enum DebuggerPanel {
  Network = 'network',
  Console = 'console',
}

export type AnyFunction = (...args: any[]) => any;

export type ID = string | undefined;

export interface NetworkRequest {
  url: string;
  status?: number;
  duration?: number;
}

// TODO: remove this
export type NetworkTab = 'headers' | 'queryStringParameters' | 'body' | 'response' | 'messages';
export type DetailTab = 'overview' | 'headers' | 'request' | 'response' | 'messages' | 'logMessage';

export interface DebuggerState {
  visibility: 'hidden' | 'bubble' | 'panel';
  position: 'top' | 'bottom';
  selectedPanel: DebuggerPanel | null;
  detailsData:
    | {
        type: DebuggerPanel.Console;
        data: LogMessage;
        selectedTab: Extract<DetailTab, 'logMessage'>;
      }
    | {
        type: DebuggerPanel.Network;
        data: HttpRequest | WebSocketRequest;
        selectedTab: Exclude<DetailTab, 'logMessage'>;
      }
    | null;
}
