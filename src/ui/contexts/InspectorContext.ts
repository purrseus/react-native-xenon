import { createContext, type MutableRefObject } from 'react';
import type { useLogInterceptor, useNetworkInterceptor } from '../../hooks';
import type {
  HttpRecord,
  InspectorPanel,
  InspectorPosition,
  InspectorVisibility,
  LogRecord,
  SetState,
  WebSocketRecord,
} from '../../types';

interface InspectorContextValue {
  inspectorVisibility: InspectorVisibility;
  setInspectorVisibility: SetState<InspectorVisibility>;
  inspectorPosition: InspectorPosition;
  setInspectorPosition: SetState<InspectorPosition>;
  panelSelected: InspectorPanel | null;
  setPanelSelected: SetState<InspectorPanel | null>;
  networkInterceptor: ReturnType<typeof useNetworkInterceptor>;
  logInterceptor: ReturnType<typeof useLogInterceptor>;
  detailsData: MutableRefObject<Partial<
    Record<InspectorPanel, LogRecord | HttpRecord | WebSocketRecord>
  > | null>;
  screenWidth: number;
  screenHeight: number;
  verticalSafeValue: number;
}

const InspectorContext = createContext<InspectorContextValue | null>(null);

export default InspectorContext;
