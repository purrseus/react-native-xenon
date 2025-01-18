import { useContext } from 'react';
import { MainContext } from '../../../contexts';
import { DebuggerPanel } from '../../../types';
import LogMessageDetails from './LogMessageDetails';
import NetworkRequestDetails from './NetworkRequestDetails';

export default function DetailsViewer() {
  const { debuggerState } = useContext(MainContext)!;
  const detailsData = debuggerState.detailsData;

  switch (detailsData?.type) {
    case DebuggerPanel.Network:
      return <NetworkRequestDetails item={detailsData.data} />;
    case DebuggerPanel.Console:
      return <LogMessageDetails item={detailsData.data} />;
    default:
      return null;
  }
}
