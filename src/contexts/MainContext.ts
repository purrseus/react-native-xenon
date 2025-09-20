import { createContext } from 'react';
import type { Updater } from 'use-immer';
import type { useConsoleInterceptor, useNetworkInterceptor } from '../hooks';
import type { DebuggerState } from '../types';
import type { ScaledSize } from 'react-native';

interface MainContextValue {
  dimensions: ScaledSize;
  debuggerState: DebuggerState;
  setDebuggerState: Updater<DebuggerState>;
  networkInterceptor: ReturnType<typeof useNetworkInterceptor>;
  consoleInterceptor: ReturnType<typeof useConsoleInterceptor>;
}

const MainContext = createContext<MainContextValue | null>(null);

export default MainContext;
