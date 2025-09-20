import { NativeEventEmitter, TurboModuleRegistry, type EmitterSubscription } from 'react-native';
import { frozen, singleton } from '../core/utils';
import type { NativeWebSocket, WebSocketHandlers } from '../types';
import { NetworkInterceptor } from './NetworkInterceptor';

const NativeWebSocketModule = TurboModuleRegistry.getEnforcing<NativeWebSocket>('WebSocketModule');

const originalWebSocketConnect = NativeWebSocketModule.connect;
const originalWebSocketSend = NativeWebSocketModule.send;
const originalWebSocketSendBinary = NativeWebSocketModule.sendBinary;
const originalWebSocketClose = NativeWebSocketModule.close;

@singleton
export default class WebSocketInterceptor extends NetworkInterceptor<WebSocketHandlers> {
  protected handlers: WebSocketHandlers = {
    connect: null,
    send: null,
    close: null,
    onOpen: null,
    onMessage: null,
    onError: null,
    onClose: null,
  };

  private eventEmitter: NativeEventEmitter | null = null;
  private subscriptions: EmitterSubscription[] = [];

  private arrayBufferToString(data?: string) {
    try {
      if (!data) return '(no input)';

      const byteArray = Buffer.from(data, 'base64');

      if (byteArray.length === 0) return '(empty array)';

      return `ArrayBuffer { length: ${byteArray.length}, values: [${byteArray.join(', ')}] }`;
    } catch (error) {
      return `(invalid data: ${error instanceof Error ? error.message : error})`;
    }
  }

  private registerEvents(): void {
    if (!this.eventEmitter) return;

    this.subscriptions = [
      this.eventEmitter.addListener('websocketOpen', ev => {
        this.handlers.onOpen?.(ev.id, Date.now());
      }),
      this.eventEmitter.addListener('websocketMessage', ev => {
        this.handlers.onMessage?.(
          ev.id,
          ev.type === 'binary' ? this.arrayBufferToString(ev.data) : ev.data,
        );
      }),
      this.eventEmitter.addListener('websocketClosed', ev => {
        this.handlers.onClose?.(ev.id, { code: ev.code, reason: ev.reason });
      }),
      this.eventEmitter.addListener('websocketFailed', ev => {
        this.handlers.onError?.(ev.id, { message: ev.message });
      }),
    ];
  }

  private unregisterEvents() {
    this.subscriptions.forEach(e => e.remove());
    this.subscriptions = [];
    this.eventEmitter = null;
  }

  @frozen
  enableInterception(): void {
    if (this.isInterceptorEnabled) return;

    this.eventEmitter = new NativeEventEmitter(NativeWebSocketModule);

    this.registerEvents();

    const { connectCallback, sendCallback, closeCallback } = this.getCallbacks();

    NativeWebSocketModule.connect = function (...args) {
      connectCallback?.(Date.now(), ...args);

      originalWebSocketConnect.call(this, ...args);
    };

    NativeWebSocketModule.send = function (...args) {
      sendCallback?.(...args);

      originalWebSocketSend.call(this, ...args);
    };

    const arrayBufferToString = this.arrayBufferToString;
    NativeWebSocketModule.sendBinary = function (base64String, socketId) {
      sendCallback?.(arrayBufferToString(base64String), socketId);

      originalWebSocketSendBinary.call(this, base64String, socketId);
    };

    NativeWebSocketModule.close = function (code, reason, socketId) {
      closeCallback?.(code, reason, socketId);

      originalWebSocketClose.call(this, code, reason, socketId);
    };

    this.isInterceptorEnabled = true;
  }

  @frozen
  disableInterception(): void {
    if (!this.isInterceptorEnabled) return;

    this.isInterceptorEnabled = false;

    NativeWebSocketModule.connect = originalWebSocketConnect;
    NativeWebSocketModule.send = originalWebSocketSend;
    NativeWebSocketModule.sendBinary = originalWebSocketSendBinary;
    NativeWebSocketModule.close = originalWebSocketClose;

    this.clearCallbacks();

    this.unregisterEvents();
  }
}
