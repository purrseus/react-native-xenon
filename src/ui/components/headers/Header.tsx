import { useState } from 'react';
import refs, { HeaderState, PanelState } from '../../../core/refs';
import IndexedStack from '../common/IndexedStack';
import ConsoleHeader from './ConsoleHeader';
import DebuggerHeader from './DebuggerHeader';
import NetworkHeader from './NetworkHeader';

const Header = () => {
  const [selectedPanel, setSelectedPanel] = useState<PanelState>(
    refs.panel.current?.getCurrentIndex() ?? PanelState.Network,
  );

  return (
    <IndexedStack defaultIndex={HeaderState.Debugger} id="debugger-header" ref={refs.header}>
      <DebuggerHeader selectedPanel={selectedPanel} setSelectedPanel={setSelectedPanel} />
      <NetworkHeader selectedPanel={selectedPanel} />
      <ConsoleHeader selectedPanel={selectedPanel} />
    </IndexedStack>
  );
};

export default Header;
