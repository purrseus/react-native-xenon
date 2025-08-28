import { createRef } from 'react';
import type { IndexedStackMethods } from '../ui/components/common/IndexedStack';
import type { TextInput } from 'react-native';

export enum DebuggerVisibility {
  Hidden = -1,
  Bubble = 0,
  Panel = 1,
  Search = 2,
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
  searchInput: createRef<TextInput>(),
};

export default refs;
