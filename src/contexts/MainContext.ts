import { createContext, type MutableRefObject } from 'react';
import type { useConsoleInterceptor, useNetworkInterceptor } from '../hooks';
import type {
  HttpRequest,
  DebuggerPanel,
  DebuggerPosition,
  DebuggerVisibility,
  LogMessage,
  SetState,
  WebSocketRequest,
} from '../types';

export interface MainContextValue {
  debuggerVisibility: DebuggerVisibility;
  setDebuggerVisibility: SetState<DebuggerVisibility>;
  debuggerPosition: DebuggerPosition;
  setDebuggerPosition: SetState<DebuggerPosition>;
  panelSelected: DebuggerPanel | null;
  setPanelSelected: SetState<DebuggerPanel | null>;
  networkInterceptor: ReturnType<typeof useNetworkInterceptor>;
  logInterceptor: ReturnType<typeof useConsoleInterceptor>;
  detailsData: MutableRefObject<
    | { [DebuggerPanel.Console]: LogMessage }
    | { [DebuggerPanel.Network]: HttpRequest | WebSocketRequest }
    | null
  >;
  screenWidth: number;
  screenHeight: number;
  verticalSafeMargin: number;
}

const MainContext = createContext<MainContextValue | null>(null);

export default MainContext;
