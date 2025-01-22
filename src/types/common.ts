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

export type ID = string | undefined;

export interface NetworkRequest {
  url: string;
  status?: number;
  duration?: number;
}

export type DetailTab = 'overview' | 'headers' | 'request' | 'response' | 'messages' | 'logMessage';

export interface DebuggerState {
  visibility: 'hidden' | 'bubble' | 'panel';
  position: 'top' | 'bottom';
  selectedPanel: DebuggerPanel | null;
  detailsData:
    | {
        type: DebuggerPanel.Network;
        data: HttpRequest | WebSocketRequest;
        selectedTab: Exclude<DetailTab, 'logMessage'>;
        beautified: boolean;
      }
    | {
        type: DebuggerPanel.Console;
        data: LogMessage;
        selectedTab: Extract<DetailTab, 'logMessage'>;
        beautified: boolean;
      }
    | null;
}
