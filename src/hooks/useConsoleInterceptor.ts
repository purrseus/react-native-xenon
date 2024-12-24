import { useCallback, useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { ConsoleInterceptor } from '../interceptors';
import type { LogMessage } from '../types';

interface ConsoleInterceptorParams {
  autoEnabled: boolean;
}

export default function useConsoleInterceptor({ autoEnabled }: ConsoleInterceptorParams) {
  const [isInterceptorEnabled, setIsInterceptorEnabled] = useState(autoEnabled);

  const [logMessages, setLogMessages] = useImmer<LogMessage[]>([]);

  const clearAllLogMessages = () => {
    setLogMessages([]);
  };

  const isEnabled = () => ConsoleInterceptor.instance.isInterceptorEnabled;

  const enableInterception = useCallback(() => {
    if (isEnabled()) return;

    ConsoleInterceptor.instance
      .set('callback', (type, args) => {
        setLogMessages(draft => {
          draft.push({ type, values: args });
        });
      })
      .enableInterception();

    setIsInterceptorEnabled(true);
  }, [setLogMessages]);

  const disableInterception = useCallback(() => {
    if (!isEnabled()) return;

    ConsoleInterceptor.instance.disableInterception();

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
    clearAllLogMessages,
    logMessages,
  };
}
