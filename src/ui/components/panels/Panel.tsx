import { Animated, Platform, StyleSheet, View, type ViewProps } from 'react-native';
import refs, { HeaderState, PanelState } from '../../../core/refs';
import IndexedStack from '../common/IndexedStack';
import LogMessageDetails from '../details/LogMessageDetails';
import NetworkRequestDetails from '../details/NetworkRequestDetails';
import ConsolePanel from './ConsolePanel';
import NetworkPanel from './NetworkPanel';
import colors from '../../../theme/colors';
import { forwardRef, useContext, useEffect, useMemo } from 'react';
import Header from '../headers/Header';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeArea from '../common/SafeArea';
import { MainContext } from '../../../contexts';
import Handle from '../handle/Handle';
import { DebuggerPanel } from '../../../types';

interface PanelProps extends ViewProps {}

const Panel = forwardRef<View, PanelProps>(({ style, ...props }, ref) => {
  const {
    debuggerState: { position, detailsData },
  } = useContext(MainContext)!;

  const containerStyle = useMemo(
    () => [
      styles.container,
      { [position]: 0, width: refs.panelSize.current?.x, height: refs.panelSize.current?.y },
    ],
    [position],
  );

  useEffect(() => {
    switch (detailsData?.type) {
      case DebuggerPanel.Network:
        refs.header.current?.setCurrentIndex(HeaderState.Network);
        refs.panel.current?.setCurrentIndex(PanelState.NetworkDetail);
        break;
      case DebuggerPanel.Console:
        refs.header.current?.setCurrentIndex(HeaderState.Console);
        refs.panel.current?.setCurrentIndex(PanelState.ConsoleDetail);
        break;
    }
  }, [detailsData?.type]);

  return (
    <Animated.View style={[containerStyle, style]} ref={ref} {...props}>
      <SafeAreaProvider>
        {position === 'bottom' && <Handle />}
        {position === 'top' && <SafeArea inset="top" />}

        <Header />

        <IndexedStack defaultIndex={PanelState.Network} id="debugger-panel" ref={refs.panel}>
          <NetworkPanel />
          <ConsolePanel />
          <NetworkRequestDetails />
          <LogMessageDetails />
        </IndexedStack>

        {position === 'top' && <Handle />}
        {position === 'bottom' && <SafeArea inset="bottom" />}
      </SafeAreaProvider>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'box-none',
    ...(Platform.OS === 'android' ? { zIndex: 9999 } : {}),
    top: undefined,
    bottom: undefined,
    backgroundColor: colors.lightGray,
    borderBottomColor: colors.gray,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default Panel;
