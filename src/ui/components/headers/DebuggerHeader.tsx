import { forwardRef, useContext } from 'react';
import type { ScrollView, StyleProp, ViewStyle } from 'react-native';
import { MainContext } from '../../../contexts';
import refs, { DebuggerVisibility, PanelState } from '../../../core/refs';
import icons from '../../../theme/icons';
import Divider from '../common/Divider';
import DebuggerHeaderItem from '../items/DebuggerHeaderItem';
import HeaderComponents from './HeaderComponents';
import { formatCount } from '../../../core/utils';

interface DebuggerHeaderProps {
  selectedPanel: PanelState;
  setSelectedPanel: React.Dispatch<React.SetStateAction<PanelState>>;
  style?: StyleProp<ViewStyle>;
}

const DebuggerHeader = forwardRef<ScrollView, DebuggerHeaderProps>(
  ({ selectedPanel, setSelectedPanel, style }, ref) => {
    const { setDebuggerState, networkInterceptor, consoleInterceptor } = useContext(MainContext)!;

    const switchTo = (panelState: PanelState) => {
      refs.panel.current?.setCurrentIndex(panelState);
      setSelectedPanel(panelState);

      setDebuggerState(draft => {
        draft.detailsData = null;
      });
    };

    const toggleNetworkInterception = () => {
      networkInterceptor.isInterceptorEnabled
        ? networkInterceptor.disableInterception()
        : networkInterceptor.enableInterception();
    };

    const toggleConsoleInterception = () => {
      consoleInterceptor.isInterceptorEnabled
        ? consoleInterceptor.disableInterception()
        : consoleInterceptor.enableInterception();
    };

    const onShowSearchInput = () => {
      refs.debugger.current?.setCurrentIndex(DebuggerVisibility.Search);
      refs.searchInput.current?.focus();
    };

    return (
      <HeaderComponents.Wrapper ref={ref} style={style}>
        <DebuggerHeaderItem onPress={onShowSearchInput} content={icons.search} />

        <HeaderComponents.MainButtons />

        <Divider type="vertical" />

        <DebuggerHeaderItem
          isLabel
          isActive={selectedPanel === PanelState.Network}
          content={`Network (${formatCount(networkInterceptor.networkRequests.size)})`}
          onPress={() => switchTo(PanelState.Network)}
        />

        <DebuggerHeaderItem
          onPress={toggleNetworkInterception}
          isActive={networkInterceptor.isInterceptorEnabled}
          content={icons.record}
        />

        <DebuggerHeaderItem
          onPress={networkInterceptor.clearAllNetworkRequests}
          content={icons.delete}
        />

        <Divider type="vertical" />

        <DebuggerHeaderItem
          isLabel
          isActive={selectedPanel === PanelState.Console}
          content={`Console (${formatCount(consoleInterceptor.logMessages.length)})`}
          onPress={() => switchTo(PanelState.Console)}
        />

        <DebuggerHeaderItem
          onPress={toggleConsoleInterception}
          isActive={consoleInterceptor.isInterceptorEnabled}
          content={icons.record}
        />

        <DebuggerHeaderItem
          onPress={consoleInterceptor.clearAllLogMessages}
          content={icons.delete}
        />
      </HeaderComponents.Wrapper>
    );
  },
);

export default DebuggerHeader;
