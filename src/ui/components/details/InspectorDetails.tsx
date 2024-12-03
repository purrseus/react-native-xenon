import { useContext } from 'react';
import type { HttpRecord, LogRecord, WebSocketRecord } from '../../../types';
import InspectorContext from '../../contexts/InspectorContext';
import LogDetails from './LogDetails';
import NetworkDetails from './NetworkDetails';

export default function InspectorDetails() {
  const { detailsData } = useContext(InspectorContext)!;

  if (!detailsData.current) return null;

  return 'log' in detailsData.current ? (
    <LogDetails item={detailsData.current.log as LogRecord} />
  ) : (
    <NetworkDetails item={detailsData.current.network as HttpRecord | WebSocketRecord} />
  );
}
