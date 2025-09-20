import { Platform, StyleSheet, View, type ViewProps } from 'react-native';
import refs, { PanelState } from '../../../core/refs';
import IndexedStack from '../common/IndexedStack';
import LogMessageDetails from '../details/LogMessageDetails';
import NetworkRequestDetails from '../details/NetworkRequestDetails';
import ConsolePanel from './ConsolePanel';
import NetworkPanel from './NetworkPanel';
import colors from '../../../theme/colors';
import { forwardRef, useContext, useMemo } from 'react';
import Header from '../headers/Header';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SafeArea from '../common/SafeArea';
import { MainContext } from '../../../contexts';

interface PanelProps extends ViewProps {}

const Panel = forwardRef<View, PanelProps>(({ style, ...props }, ref) => {
  const {
    debuggerState: { position },
    dimensions: { width: screenWidth, height: screenHeight },
  } = useContext(MainContext)!;

  const containerStyle = useMemo(
    () => [styles.container, { [position]: 0, height: Math.min(screenWidth, screenHeight) * 0.75 }],
    [position, screenWidth, screenHeight],
  );

  return (
    <View style={[containerStyle, style]} ref={ref} {...props}>
      <SafeAreaProvider>
        {position === 'top' && <SafeArea inset="top" />}

        <Header />

        <IndexedStack defaultIndex={PanelState.Network} id="debugger-panel" ref={refs.panel}>
          <NetworkPanel />
          <ConsolePanel />
          <NetworkRequestDetails />
          <LogMessageDetails />
        </IndexedStack>

        {position === 'bottom' && <SafeArea inset="bottom" />}
      </SafeAreaProvider>
    </View>
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
