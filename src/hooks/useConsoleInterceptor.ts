import { useCallback, useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { ConsoleInterceptor } from '../interceptors';
import type { LogMessage } from '../types';

interface ConsoleInterceptorParams {
  autoEnabled: boolean;
}

const consoleInterceptor = new ConsoleInterceptor();

export default function useConsoleInterceptor({ autoEnabled }: ConsoleInterceptorParams) {
  const [isInterceptorEnabled, setIsInterceptorEnabled] = useState(autoEnabled);

  const [logMessages, setLogMessages] = useImmer<LogMessage[]>([]);

  const clearAllLogMessages = () => {
    setLogMessages([]);
  };

  const isEnabled = () => consoleInterceptor.isInterceptorEnabled;

  const enableInterception = useCallback(() => {
    if (isEnabled()) return;

    consoleInterceptor
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

    consoleInterceptor.disableInterception();

    setIsInterceptorEnabled(false);
  }, []);

  useEffect(() => {
    if (autoEnabled) {
      enableInterception();
      return disableInterception;
    }
  }, [autoEnabled, disableInterception, enableInterception]);

  return {
    isInterceptorEnabled,
    enableInterception,
    disableInterception,
    clearAllLogMessages,
    logMessages,
  };
}
