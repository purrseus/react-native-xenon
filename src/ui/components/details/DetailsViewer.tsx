import { detailsData } from '../../../data';
import { DebuggerPanel } from '../../../types';
import LogMessageDetails from './LogMessageDetails';
import NetworkRequestDetails from './NetworkRequestDetails';

export default function DetailsViewer() {
  if (!detailsData.value) return null;

  switch (true) {
    case DebuggerPanel.Network in detailsData.value:
      return <NetworkRequestDetails item={detailsData.value.network} />;
    case DebuggerPanel.Console in detailsData.value:
      return <LogMessageDetails item={detailsData.value.console} />;
    default:
      return null;
  }
}
