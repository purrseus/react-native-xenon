import type { NetworkRequest, NetworkType } from './common';

export interface WebSocketRequest extends NetworkRequest {
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
      uri: WebSocketRequest['uri'],
      protocols?: WebSocketRequest['protocols'],
      options?: WebSocketRequest['options'],
      socketId?: number,
    ) => void)
  | null;

export type WebSocketSendCallback = ((data: string, socketId: number) => void) | null;

export type WebSocketCloseCallback =
  | ((
      code: WebSocketRequest['status'],
      reason: WebSocketRequest['closeReason'],
      socketId: number,
    ) => void)
  | null;

export type WebSocketOnOpenCallback = ((socketId: number) => void) | null;

export type WebSocketOnMessageCallback = ((socketId: number, message: any) => void) | null;

export type WebSocketOnErrorCallback =
  | ((socketId: number, data: WebSocketRequest['serverError']) => void)
  | null;

export type WebSocketOnCloseCallback =
  | ((socketId: number, data: WebSocketRequest['serverClose']) => void)
  | null;
