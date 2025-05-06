import { createRef } from 'react';
import type { IndexedStackMethods } from '../ui/components/common/IndexedStack';

export enum DebuggerVisibility {
  Hidden = -1,
  Bubble = 0,
  Panel = 1,
}

export enum PanelState {
  Network = 0,
  Console = 1,
  NetworkDetail = 2,
  ConsoleDetail = 3,
}

export enum HeaderState {
  Debugger = 0,
  Network = 1,
  Console = 2,
}

const refs = {
  debugger: createRef<IndexedStackMethods<DebuggerVisibility>>(),
  panel: createRef<IndexedStackMethods<PanelState>>(),
  header: createRef<IndexedStackMethods<HeaderState>>(),
};

export default refs;
