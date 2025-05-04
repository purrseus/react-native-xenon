import refs, { PanelState } from '../../../core/refs';
import IndexedStack from '../common/IndexedStack';
import DetailsViewer from '../details/DetailsViewer';
import ConsolePanel from './ConsolePanel';
import NetworkPanel from './NetworkPanel';

export default function Panel() {
  return (
    <IndexedStack defaultIndex={PanelState.Network} id="debugger-panel" ref={refs.panel}>
      <NetworkPanel />
      <ConsolePanel />
      <DetailsViewer />
    </IndexedStack>
  );
}
