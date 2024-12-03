import base64 from 'base64-js';
import { NativeEventEmitter, type EmitterSubscription } from 'react-native';
import NativeWebSocketModule from 'react-native/Libraries/WebSocket/NativeWebSocketModule';
import type {
  WebSocketCloseCallback,
  WebSocketConnectCallback,
  WebSocketOnCloseCallback,
  WebSocketOnErrorCallback,
  WebSocketOnMessageCallback,
  WebSocketOnOpenCallback,
  WebSocketSendCallback,
} from '../types';
import { NetworkInterceptor } from './NetworkInterceptor';

const originalWebSocketConnect = NativeWebSocketModule.connect;
const originalWebSocketSend = NativeWebSocketModule.send;
const originalWebSocketSendBinary = NativeWebSocketModule.sendBinary;
const originalWebSocketClose = NativeWebSocketModule.close;

export default class WebSocketInterceptor extends NetworkInterceptor {
  static instance = new WebSocketInterceptor();

  private constructor() {
    super();
  }

  private connectCallback: WebSocketConnectCallback = null;
  private sendCallback: WebSocketSendCallback = null;
  private closeCallback: WebSocketCloseCallback = null;
  private onOpenCallback: WebSocketOnOpenCallback = null;
  private onMessageCallback: WebSocketOnMessageCallback = null;
  private onErrorCallback: WebSocketOnErrorCallback = null;
  private onCloseCallback: WebSocketOnCloseCallback = null;

  setConnectCallback(callback: typeof this.connectCallback) {
    this.connectCallback = callback;
    return this;
  }

  setSendCallback(callback: typeof this.sendCallback) {
    this.sendCallback = callback;
    return this;
  }

  setCloseCallback(callback: typeof this.closeCallback) {
    this.closeCallback = callback;
    return this;
  }

  setOnOpenCallback(callback: typeof this.onOpenCallback) {
    this.onOpenCallback = callback;
    return this;
  }

  setOnMessageCallback(callback: typeof this.onMessageCallback) {
    this.onMessageCallback = callback;
    return this;
  }

  setOnErrorCallback(callback: typeof this.onErrorCallback) {
    this.onErrorCallback = callback;
    return this;
  }

  setOnCloseCallback(callback: typeof this.onCloseCallback) {
    this.onCloseCallback = callback;
    return this;
  }

  protected getCallbacks() {
    const connectCallback = this.connectCallback?.bind(this);
    const sendCallback = this.sendCallback?.bind(this);
    const closeCallback = this.closeCallback?.bind(this);
    const arrayBufferToString = this.arrayBufferToString?.bind(this);

    return {
      connectCallback,
      sendCallback,
      closeCallback,
      arrayBufferToString,
    };
  }

  protected clearCallbacks(): void {
    this.connectCallback = null;
    this.sendCallback = null;
    this.closeCallback = null;
    this.onOpenCallback = null;
    this.onMessageCallback = null;
    this.onErrorCallback = null;
    this.onCloseCallback = null;
  }

  private eventEmitter: NativeEventEmitter | null = null;
  private subscriptions: EmitterSubscription[] = [];

  private arrayBufferToString(data: string) {
    const value = base64.toByteArray(data).buffer;

    if (value === undefined || value === null) return '(no value)';

    if (
      typeof ArrayBuffer !== 'undefined' &&
      typeof Uint8Array !== 'undefined' &&
      value instanceof ArrayBuffer
    )
      return `ArrayBuffer {${String(Array.from(new Uint8Array(value)))}}`;

    return value;
  }

  private registerEvents(): void {
    if (!this.eventEmitter) return;

    this.subscriptions = [
      this.eventEmitter.addListener('websocketOpen', ev => {
        this.onOpenCallback?.(ev.id);
      }),
      this.eventEmitter.addListener('websocketMessage', ev => {
        this.onMessageCallback?.(
          ev.id,
          ev.type === 'binary' ? this.arrayBufferToString(ev.data) : ev.data,
        );
      }),
      this.eventEmitter.addListener('websocketClosed', ev => {
        this.onCloseCallback?.(ev.id, { code: ev.code, reason: ev.reason });
      }),
      this.eventEmitter.addListener('websocketFailed', ev => {
        this.onErrorCallback?.(ev.id, { message: ev.message });
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

    const { connectCallback, sendCallback, closeCallback, arrayBufferToString } =
      this.getCallbacks();

    NativeWebSocketModule.connect = function (url, protocols, options, socketId) {
      connectCallback?.(url, protocols, options, socketId);

      originalWebSocketConnect.apply(
        this,
        arguments as unknown as Parameters<typeof originalWebSocketConnect>,
      );
    };

    NativeWebSocketModule.send = function (data, socketId) {
      sendCallback?.(data, socketId);

      originalWebSocketSend.apply(
        this,
        arguments as unknown as Parameters<typeof originalWebSocketSend>,
      );
    };

    NativeWebSocketModule.sendBinary = function (data, socketId) {
      sendCallback?.(arrayBufferToString(data) as any, socketId);

      originalWebSocketSendBinary.apply(
        this,
        arguments as unknown as Parameters<typeof originalWebSocketSendBinary>,
      );
    };

    NativeWebSocketModule.close = function (code, reason, socketId) {
      closeCallback?.(code, reason, socketId);

      originalWebSocketClose.apply(
        this,
        arguments as unknown as Parameters<typeof originalWebSocketClose>,
      );
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
