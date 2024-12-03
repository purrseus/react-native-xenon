import { useCallback, useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import LogInterceptor from '../interceptors/LogInterceptor';
import type { LogRecord } from '../types';

interface LogInterceptorParams {
  autoEnabled?: boolean;
}

export default function useLogInterceptor(params: LogInterceptorParams) {
  const { autoEnabled = false } = params || {};

  const [isInterceptorEnabled, setIsInterceptorEnabled] = useState(autoEnabled);

  const [logRecords, setLogRecords] = useImmer<LogRecord[]>([]);

  const clearAllRecords = () => {
    setLogRecords([]);
  };

  const _isInterceptorEnabled = () => LogInterceptor.instance.isInterceptorEnabled;

  const enableInterception = useCallback(() => {
    if (_isInterceptorEnabled()) return;

    LogInterceptor.instance
      .setCallback((type, args) => {
        setLogRecords(draft => {
          draft.push({ type, values: Array.from(args) });
        });
      })
      .enableInterception();

    setIsInterceptorEnabled(true);
  }, [setLogRecords]);

  const disableInterception = useCallback(() => {
    if (!_isInterceptorEnabled()) return;

    LogInterceptor.instance.disableInterception();

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
    logRecords,
  };
}
