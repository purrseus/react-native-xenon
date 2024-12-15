import type { Dispatch, SetStateAction } from 'react';

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

export type DebuggerVisibility = 'hidden' | 'bubble' | 'panel';

export type DebuggerPosition = 'top' | 'bottom';

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type NetworkTab = 'headers' | 'queryStringParameters' | 'body' | 'response' | 'messages';
