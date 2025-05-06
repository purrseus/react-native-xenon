import refs, { PanelState } from '../../../core/refs';
import IndexedStack from '../common/IndexedStack';
import LogMessageDetails from '../details/LogMessageDetails';
import NetworkRequestDetails from '../details/NetworkRequestDetails';
import ConsolePanel from './ConsolePanel';
import NetworkPanel from './NetworkPanel';

export default function Panel() {
  return (
    <IndexedStack defaultIndex={PanelState.Network} id="debugger-panel" ref={refs.panel}>
      <NetworkPanel />
      <ConsolePanel />
      <NetworkRequestDetails />
      <LogMessageDetails />
    </IndexedStack>
  );
}
