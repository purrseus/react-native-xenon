interface XMLHttpRequest {
  _interceptionId?: string;
}

declare module 'react-native/Libraries/WebSocket/NativeWebSocketModule' {
  interface NativeWebSocketModule extends NativeModule {
    connect(
      url: string,
      protocols?: string | string[],
      options?: {
        headers: { [headerName: string]: string };
        [optionName: string]: any;
      },
      socketId: number,
    ): void;

    send(data: string, socketId: number): void;

    sendBinary(base64String: string, socketId: number): void;

    close(code: number, reason: string, socketId: number): void;

    addListener: (eventType: string) => void;
    removeListeners: (count: number) => void;
  }

  const NativeWebSocketModule: NativeWebSocketModule;
  export default NativeWebSocketModule;
}
