import type { Dispatch, SetStateAction } from 'react';

export enum NetworkType {
  XHR = 'xhr',
  Fetch = 'fetch',
  WS = 'ws',
}

export type ID = string | undefined;

export interface NetworkRecord {
  status?: number;
}

export type DebuggerVisibility = 'hidden' | 'bubble' | 'panel';

export type DebuggerPosition = 'top' | 'bottom';

export type DebuggerPanel = 'network' | 'log';

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type NetworkTab = 'headers' | 'queryStringParameters' | 'body' | 'response' | 'messages';
