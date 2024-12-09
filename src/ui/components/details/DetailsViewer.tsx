import { useContext } from 'react';
import { MainContext } from '../../../contexts';
import { DebuggerPanel } from '../../../types';
import LogMessageDetails from './LogMessageDetails';
import NetworkRequestDetails from './NetworkRequestDetails';

export default function DetailsViewer() {
  const { detailsData } = useContext(MainContext)!;

  switch (true) {
    case !detailsData.current:
      return null;
    case DebuggerPanel.Network in detailsData.current!:
      return <NetworkRequestDetails item={detailsData.current.network} />;
    case DebuggerPanel.Console in detailsData.current!:
      return <LogMessageDetails item={detailsData.current.console} />;
    default:
      return null;
  }
}
