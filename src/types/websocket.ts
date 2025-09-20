import type { TurboModule } from 'react-native';
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

export interface WebSocketHandlers {
  connect:
    | ((
        startTime: number,
        url: string,
        protocols?: WebSocketRequest['protocols'],
        options?: WebSocketRequest['options'],
        socketId?: number,
      ) => void)
    | null;
  send: ((data: string, socketId: number) => void) | null;
  close: ((code: number, reason: string, socketId: number) => void) | null;
  onOpen: ((socketId: number, endTime: number) => void) | null;
  onMessage: ((socketId: number, message: any) => void) | null;
  onError: ((socketId: number, error: WebSocketRequest['serverError']) => void) | null;
  onClose: ((socketId: number, data: WebSocketRequest['serverClose']) => void) | null;
}

export interface NativeWebSocket extends TurboModule {
  connect: (
    url: string,
    protocols?: Array<string>,
    options?: WebSocketRequest['options'],
    socketID?: number,
  ) => void;
  send: (message: string, forSocketID: number) => void;
  sendBinary: (base64String: string, forSocketID: number) => void;
  ping: (socketID: number) => void;
  close: (code: number, reason: string, socketID: number) => void;
  addListener: (eventName: string) => void;
  removeListeners: (count: number) => void;
}
