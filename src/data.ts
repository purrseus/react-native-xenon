import type { DebuggerPanel, LogMessage, HttpRequest, WebSocketRequest } from './types';

const detailsData: {
  value:
    | { [DebuggerPanel.Console]: LogMessage }
    | { [DebuggerPanel.Network]: HttpRequest | WebSocketRequest }
    | null;
} = {
  value: null,
};

export { detailsData };
