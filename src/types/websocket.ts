import type { NetworkRecord, NetworkType } from './common';

export interface WebSocketRecord extends NetworkRecord {
  type: NetworkType.WS;
  uri: string;
  protocols?: string | string[] | null;
  options?: {
    headers: { [headerName: string]: string };
    [optionName: string]: any;
  } | null;
  messages?: string;
  closeReason?: string;
  serverError?: { message?: string };
  serverClose?: { code?: number; reason?: string };
}

export type WebSocketConnectCallback =
  | ((
      uri: WebSocketRecord['uri'],
      protocols?: WebSocketRecord['protocols'],
      options?: WebSocketRecord['options'],
      socketId?: number,
    ) => void)
  | null;

export type WebSocketSendCallback = ((data: string | ArrayBuffer, socketId: number) => void) | null;

export type WebSocketCloseCallback =
  | ((
      code: WebSocketRecord['status'],
      reason: WebSocketRecord['closeReason'],
      socketId: number,
    ) => void)
  | null;

export type WebSocketOnOpenCallback = ((socketId: number) => void) | null;

export type WebSocketOnMessageCallback = ((socketId: number, message: any) => void) | null;

export type WebSocketOnErrorCallback =
  | ((socketId: number, data: WebSocketRecord['serverError']) => void)
  | null;

export type WebSocketOnCloseCallback =
  | ((socketId: number, data: WebSocketRecord['serverClose']) => void)
  | null;
