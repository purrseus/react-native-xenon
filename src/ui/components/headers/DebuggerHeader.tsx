import { useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { MainContext } from '../../../contexts';
import { DebuggerPanel } from '../../../types';
import DebuggerHeaderItem from '../items/DebuggerHeaderItem';
import icons from '../../../theme/icons';
import colors from '../../../theme/colors';

export default function DebuggerHeader() {
  const { debuggerState, setDebuggerState, networkInterceptor, logInterceptor } =
    useContext(MainContext)!;

  const hideDebugger = () => {
    setDebuggerState(draft => {
      draft.visibility = 'hidden';
    });
  };

  const toggleNetworkInterception = () => {
    networkInterceptor.isInterceptorEnabled
      ? networkInterceptor.disableInterception()
      : networkInterceptor.enableInterception();
  };

  const toggleLogInterception = () => {
    logInterceptor.isInterceptorEnabled
      ? logInterceptor.disableInterception()
      : logInterceptor.enableInterception();
  };

  const toggleDebuggerPosition = () => {
    setDebuggerState(draft => {
      draft.position = draft.position === 'bottom' ? 'top' : 'bottom';
    });
  };

  const switchToNetworkPanel = () => {
    setDebuggerState(draft => {
      draft.selectedPanel = DebuggerPanel.Network;
    });
  };

  const switchToConsolePanel = () => {
    setDebuggerState(draft => {
      draft.selectedPanel = DebuggerPanel.Console;
    });
  };

  return (
    <ScrollView
      horizontal
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsHorizontalScrollIndicator={false}
    >
      <DebuggerHeaderItem onPress={hideDebugger} content={icons.hide} />

      <DebuggerHeaderItem onPress={toggleDebuggerPosition} content={icons.move} />

      <DebuggerHeaderItem
        isLabel
        isActive={debuggerState.selectedPanel === DebuggerPanel.Network}
        content="Network Panel"
        onPress={switchToNetworkPanel}
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

      <View style={styles.divider} />

      <DebuggerHeaderItem
        isLabel
        isActive={debuggerState.selectedPanel === DebuggerPanel.Console}
        content="Log Panel"
        onPress={switchToConsolePanel}
      />

      <DebuggerHeaderItem
        onPress={toggleLogInterception}
        isActive={logInterceptor.isInterceptorEnabled}
        content={icons.record}
      />

      <DebuggerHeaderItem onPress={logInterceptor.clearAllLogMessages} content={icons.delete} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  contentContainer: {
    padding: 8,
    columnGap: 8,
  },
  divider: {
    width: 1,
    backgroundColor: colors.gray,
  },
});
