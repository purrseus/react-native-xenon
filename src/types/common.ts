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

export type NetworkTab = 'headers' | 'queryStringParameters' | 'body' | 'response' | 'messages';

export interface DebuggerState {
  visibility: 'hidden' | 'bubble' | 'panel';
  position: 'top' | 'bottom';
  selectedPanel: DebuggerPanel | null;
}
