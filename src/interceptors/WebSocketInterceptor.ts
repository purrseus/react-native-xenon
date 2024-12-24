import { NativeEventEmitter, type EmitterSubscription } from 'react-native';
import NativeWebSocketModule from 'react-native/Libraries/WebSocket/NativeWebSocketModule';
import type { WebSocketHandlers } from '../types';
import { NetworkInterceptor } from './NetworkInterceptor';

const originalWebSocketConnect = NativeWebSocketModule.connect;
const originalWebSocketSend = NativeWebSocketModule.send;
const originalWebSocketSendBinary = NativeWebSocketModule.sendBinary;
const originalWebSocketClose = NativeWebSocketModule.close;

export default class WebSocketInterceptor extends NetworkInterceptor<WebSocketHandlers> {
  static readonly instance = new WebSocketInterceptor();

  protected handlers: WebSocketHandlers = {
    connect: null,
    send: null,
    close: null,
    onOpen: null,
    onMessage: null,
    onError: null,
    onClose: null,
  };

  private constructor() {
    super();
  }

  protected getCallbacks() {
    const connect = this.handlers.connect;
    const send = this.handlers.send;
    const close = this.handlers.close;
    const arrayBufferToString = this.arrayBufferToString;

    return { connect, send, close, arrayBufferToString };
  }

  protected clearCallbacks(): void {
    this.handlers.connect = null;
    this.handlers.send = null;
    this.handlers.close = null;
    this.handlers.onOpen = null;
    this.handlers.onMessage = null;
    this.handlers.onError = null;
    this.handlers.onClose = null;
  }

  private eventEmitter: NativeEventEmitter | null = null;
  private subscriptions: EmitterSubscription[] = [];
  private readonly timeStart: Map<number, number> = new Map();

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
        const timeStart = this.timeStart.get(ev.id);
        const timeEnd = Date.now();
        const duration = timeEnd - (timeStart ?? 0);
        this.timeStart.delete(ev.id);

        this.handlers.onOpen?.(ev.id, duration);
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

  enableInterception(): void {
    if (this.isInterceptorEnabled) return;

    this.eventEmitter = new NativeEventEmitter(NativeWebSocketModule);

    this.registerEvents();

    const { connect, send, close, arrayBufferToString } = this.getCallbacks();

    const timeStart = this.timeStart;
    NativeWebSocketModule.connect = function (...args) {
      connect?.(...args);

      timeStart.set(args[3], Date.now());

      originalWebSocketConnect.call(this, ...args);
    };

    NativeWebSocketModule.send = function (...args) {
      send?.(...args);

      originalWebSocketSend.call(this, ...args);
    };

    NativeWebSocketModule.sendBinary = function (base64String, socketId) {
      send?.(arrayBufferToString(base64String), socketId);

      originalWebSocketSendBinary.call(this, base64String, socketId);
    };

    NativeWebSocketModule.close = function (code, reason, socketId) {
      close?.(code, reason, socketId);

      originalWebSocketClose.call(this, code, reason, socketId);
    };

    this.isInterceptorEnabled = true;
  }

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
