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

type WebSocketConnectCallback =
  | ((
      url: string,
      protocols?: WebSocketRequest['protocols'],
      options?: WebSocketRequest['options'],
      socketId?: number,
    ) => void)
  | null;

type WebSocketSendCallback = ((data: string, socketId: number) => void) | null;

type WebSocketCloseCallback = ((code: number, reason: string, socketId: number) => void) | null;

type WebSocketOnOpenCallback = ((socketId: number, duration: number) => void) | null;

type WebSocketOnMessageCallback = ((socketId: number, message: any) => void) | null;

type WebSocketOnErrorCallback =
  | ((socketId: number, error: WebSocketRequest['serverError']) => void)
  | null;

type WebSocketOnCloseCallback =
  | ((socketId: number, data: WebSocketRequest['serverClose']) => void)
  | null;

export interface WebSocketHandlers {
  connect: WebSocketConnectCallback;
  send: WebSocketSendCallback;
  close: WebSocketCloseCallback;
  onOpen: WebSocketOnOpenCallback;
  onMessage: WebSocketOnMessageCallback;
  onError: WebSocketOnErrorCallback;
  onClose: WebSocketOnCloseCallback;
}
