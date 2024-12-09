import { useContext } from 'react';
import type { HttpRecord, LogRecord, WebSocketRecord } from '../../../types';
import Context from '../../Context';
import LogMessageDetails from './LogMessageDetails';
import NetworkRequestDetails from './NetworkRequestDetails';

export default function DetailsViewer() {
  const { detailsData } = useContext(Context)!;

  if (!detailsData.current) return null;

  return 'log' in detailsData.current ? (
    <LogMessageDetails item={detailsData.current.log as LogRecord} />
  ) : (
    <NetworkRequestDetails item={detailsData.current.network as HttpRecord | WebSocketRecord} />
  );
}
