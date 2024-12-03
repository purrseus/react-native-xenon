import { enableMapSet } from 'immer';
import { useCallback, useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { NETWORK_INSPECTOR_REQUEST_HEADER } from '../constants';
import {
  NetworkType,
  type HttpHeaderReceivedCallback,
  type HttpOpenCallback,
  type HttpRecord,
  type HttpRequestHeaderCallback,
  type HttpResponseCallback,
  type HttpSendCallback,
  type ID,
  type WebSocketCloseCallback,
  type WebSocketConnectCallback,
  type WebSocketOnCloseCallback,
  type WebSocketOnErrorCallback,
  type WebSocketOnMessageCallback,
  type WebSocketOnOpenCallback,
  type WebSocketRecord,
  type WebSocketSendCallback,
} from '../types';
import { createHttpHeaderLine, createSocketDataLine } from '../utils';
import { XHRInterceptor, FetchInterceptor, WebSocketInterceptor } from '../interceptors';

interface NetworkInterceptorParams {
  autoEnabled?: boolean;
}

type NetworkRecords<T> = Map<NonNullable<ID>, T>;

enableMapSet();

const initRecords = new Map<NonNullable<ID>, HttpRecord & WebSocketRecord>();

export default function useNetworkInterceptor(params?: NetworkInterceptorParams) {
  const { autoEnabled = false } = params || {};
  const [isInterceptorEnabled, setIsInterceptorEnabled] = useState(autoEnabled);

  const [networkRecords, setNetworkRecords] = useImmer(initRecords);

  const _isInterceptorEnabled = () =>
    XHRInterceptor.instance.isInterceptorEnabled &&
    FetchInterceptor.instance.isInterceptorEnabled &&
    WebSocketInterceptor.instance.isInterceptorEnabled;

  const clearAllRecords = () => {
    setNetworkRecords(initRecords);
  };

  const enableHttpInterceptions = useCallback(() => {
    const openCallback: HttpOpenCallback = (id, type, method, url) => {
      if (!id) return;

      setNetworkRecords((draft: NetworkRecords<HttpRecord>) => {
        draft.set(id, { type, method, url });
      });
    };

    const requestHeaderCallback: HttpRequestHeaderCallback = (id, header, value) => {
      if (!id) return;

      setNetworkRecords((draft: NetworkRecords<HttpRecord>) => {
        if (!draft.get(id)) return draft;

        const currentHeaderLine = createHttpHeaderLine(header, value);

        const fetchRequestHeaderLineRegex = RegExp(
          createHttpHeaderLine(NETWORK_INSPECTOR_REQUEST_HEADER, NetworkType.Fetch),
          'gi',
        );

        const isFetchInXHR =
          draft.get(id)!.type === NetworkType.XHR &&
          !!currentHeaderLine.match(fetchRequestHeaderLineRegex);

        if (isFetchInXHR) {
          draft.delete(id);
        } else {
          draft.get(id)!.requestHeaders ??= '';
          draft.get(id)!.requestHeaders += currentHeaderLine;
        }
      });
    };

    const sendCallback: HttpSendCallback = (id, data) => {
      if (!id) return;

      setNetworkRecords((draft: NetworkRecords<HttpRecord>) => {
        if (!draft.get(id)) return draft;

        draft.get(id)!.body = data;
      });
    };

    const headerReceivedCallback: HttpHeaderReceivedCallback = (
      id,
      responseContentType,
      responseSize,
      responseHeaders,
    ) => {
      if (!id) return;

      setNetworkRecords((draft: NetworkRecords<HttpRecord>) => {
        if (!draft.get(id)) return draft;

        draft.get(id)!.responseContentType = responseContentType;
        draft.get(id)!.responseSize = responseSize;
        draft.get(id)!.responseHeaders = responseHeaders;
      });
    };

    const responseCallback: HttpResponseCallback = (
      id,
      status,
      timeout,
      response,
      responseURL,
      responseType,
    ) => {
      if (!id) return;

      setNetworkRecords((draft: NetworkRecords<HttpRecord>) => {
        if (!draft.get(id)) return draft;

        draft.get(id)!.status = status;
        draft.get(id)!.timeout = timeout;
        draft.get(id)!.response = response;
        if (responseURL) draft.get(id)!.url = responseURL;
        draft.get(id)!.responseType = responseType;
      });
    };

    XHRInterceptor.instance
      .setOpenCallback(openCallback)
      .setRequestHeaderCallback(requestHeaderCallback)
      .setSendCallback(sendCallback)
      .setHeaderReceivedCallback(headerReceivedCallback)
      .setResponseCallback(responseCallback)
      .enableInterception();

    FetchInterceptor.instance
      .setOpenCallback(openCallback)
      .setRequestHeaderCallback(requestHeaderCallback)
      .setSendCallback(sendCallback)
      .setHeaderReceivedCallback(headerReceivedCallback)
      .setResponseCallback(responseCallback)
      .enableInterception();
  }, [setNetworkRecords]);

  const enableWebSocketInterception = useCallback(() => {
    const connectCallback: WebSocketConnectCallback = (uri, protocols, options, socketId) => {
      if (typeof socketId !== 'number') return;

      setNetworkRecords((draft: NetworkRecords<WebSocketRecord>) => {
        draft.set(`${socketId}`, {
          uri,
          type: NetworkType.WS,
          protocols,
          options,
        });
      });
    };

    const sendCallback: WebSocketSendCallback = (data, socketId) => {
      if (typeof socketId !== 'number') return;

      setNetworkRecords((draft: NetworkRecords<WebSocketRecord>) => {
        if (!draft.get(`${socketId}`)) return draft;

        draft.get(`${socketId}`)!.messages ??= '';
        draft.get(`${socketId}`)!.messages += createSocketDataLine('Sent', data);
      });
    };

    const closeCallback: WebSocketCloseCallback = (code, reason, socketId) => {
      if (typeof socketId !== 'number') return;

      setNetworkRecords((draft: NetworkRecords<WebSocketRecord>) => {
        if (!draft.get(`${socketId}`)) return draft;

        draft.get(`${socketId}`)!.status = code;
        draft.get(`${socketId}`)!.closeReason = reason;
      });
    };

    const onOpenCallback: WebSocketOnOpenCallback = () => {};

    const onMessageCallback: WebSocketOnMessageCallback = (socketId, message) => {
      if (typeof socketId !== 'number') return;

      setNetworkRecords((draft: NetworkRecords<WebSocketRecord>) => {
        if (!draft.get(`${socketId}`)) return draft;

        draft.get(`${socketId}`)!.messages ??= '';
        draft.get(`${socketId}`)!.messages += createSocketDataLine('Received', message);
      });
    };

    const onErrorCallback: WebSocketOnErrorCallback = (socketId, data) => {
      if (typeof socketId !== 'number') return;

      setNetworkRecords((draft: NetworkRecords<WebSocketRecord>) => {
        if (!draft.get(`${socketId}`)) return draft;

        draft.get(`${socketId}`)!.serverError = data;
      });
    };

    const onCloseCallback: WebSocketOnCloseCallback = (socketId, data) => {
      if (typeof socketId !== 'number') return;

      setNetworkRecords((draft: NetworkRecords<WebSocketRecord>) => {
        if (!draft.get(`${socketId}`)) return draft;

        draft.get(`${socketId}`)!.serverClose = data;
      });
    };

    WebSocketInterceptor.instance
      .setConnectCallback(connectCallback)
      .setSendCallback(sendCallback)
      .setCloseCallback(closeCallback)
      .setOnOpenCallback(onOpenCallback)
      .setOnMessageCallback(onMessageCallback)
      .setOnErrorCallback(onErrorCallback)
      .setOnCloseCallback(onCloseCallback)
      .enableInterception();
  }, [setNetworkRecords]);

  const enableInterception = useCallback(() => {
    if (_isInterceptorEnabled()) return;

    enableHttpInterceptions();
    enableWebSocketInterception();
    setIsInterceptorEnabled(true);
  }, [enableHttpInterceptions, enableWebSocketInterception]);

  const disableInterception = useCallback(() => {
    if (!_isInterceptorEnabled()) return;

    XHRInterceptor.instance.disableInterception();
    FetchInterceptor.instance.disableInterception();
    WebSocketInterceptor.instance.disableInterception();
    setIsInterceptorEnabled(false);
  }, []);

  useEffect(() => {
    if (autoEnabled) enableInterception();

    if (autoEnabled) return disableInterception;
  }, [autoEnabled, disableInterception, enableInterception]);

  return {
    isInterceptorEnabled,
    enableInterception,
    disableInterception,
    clearAllRecords,
    networkRecords,
  };
}
