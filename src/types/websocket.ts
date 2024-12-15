import type { NetworkRequest, NetworkType } from './common';

export interface WebSocketRequest extends NetworkRequest {
  type: NetworkType.WS;
  protocols?: string | string[];
  options?: {
    headers: { [headerName: string]: string };
    [optionName: string]: any;
  };
  messages?: string;
  closeReason?: string;
  serverError?: { message?: string };
  serverClose?: { code?: number; reason?: string };
}

export type WebSocketConnectCallback =
  | ((
      url: string,
      protocols?: WebSocketRequest['protocols'],
      options?: WebSocketRequest['options'],
      socketId?: number,
    ) => void)
  | null;

export type WebSocketSendCallback = ((data: string, socketId: number) => void) | null;

export type WebSocketCloseCallback =
  | ((code: number, reason: string, socketId: number) => void)
  | null;

export type WebSocketOnOpenCallback = ((socketId: number, duration: number) => void) | null;

export type WebSocketOnMessageCallback = ((socketId: number, message: any) => void) | null;

export type WebSocketOnErrorCallback =
  | ((socketId: number, error: WebSocketRequest['serverError']) => void)
  | null;

export type WebSocketOnCloseCallback =
  | ((socketId: number, data: WebSocketRequest['serverClose']) => void)
  | null;
