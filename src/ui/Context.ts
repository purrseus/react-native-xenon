import { createContext, type MutableRefObject } from 'react';
import type { useLogInterceptor, useNetworkInterceptor } from '../hooks';
import type {
  HttpRecord,
  DebuggerPanel,
  DebuggerPosition,
  DebuggerVisibility,
  LogRecord,
  SetState,
  WebSocketRecord,
} from '../types';

interface ContextValue {
  debuggerVisibility: DebuggerVisibility;
  setDebuggerVisibility: SetState<DebuggerVisibility>;
  debuggerPosition: DebuggerPosition;
  setDebuggerPosition: SetState<DebuggerPosition>;
  panelSelected: DebuggerPanel | null;
  setPanelSelected: SetState<DebuggerPanel | null>;
  networkInterceptor: ReturnType<typeof useNetworkInterceptor>;
  logInterceptor: ReturnType<typeof useLogInterceptor>;
  detailsData: MutableRefObject<Partial<
    Record<DebuggerPanel, LogRecord | HttpRecord | WebSocketRecord>
  > | null>;
  screenWidth: number;
  screenHeight: number;
  verticalSafeValue: number;
}

const Context = createContext<ContextValue | null>(null);

export default Context;
