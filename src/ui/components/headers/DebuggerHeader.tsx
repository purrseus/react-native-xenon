import { useContext, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { MainContext } from '../../../contexts';
import colors from '../../../theme/colors';
import icons from '../../../theme/icons';
import { DebuggerPanel } from '../../../types';
import DebuggerHeaderItem from '../items/DebuggerHeaderItem';

interface DebuggerHeaderProps {
  detailsShown: boolean;
}

export default function DebuggerHeader({ detailsShown }: DebuggerHeaderProps) {
  const { debuggerState, setDebuggerState, networkInterceptor, logInterceptor } =
    useContext(MainContext)!;

  const lastSelectedPanel = useRef<DebuggerPanel>(
    debuggerState.selectedPanel ?? DebuggerPanel.Network,
  );

  const hideDebugger = () => {
    setDebuggerState(draft => {
      draft.visibility = 'bubble';
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

  const switchTo = (debuggerPanel: DebuggerPanel) => {
    setDebuggerState(draft => {
      draft.selectedPanel = debuggerPanel;
      lastSelectedPanel.current = debuggerPanel;
    });
  };

  if (detailsShown) {
    return (
      <View style={styles.contentContainer}>
        <DebuggerHeaderItem
          isLabel
          isActive
          content="Go Back"
          onPress={() => {
            setDebuggerState(draft => {
              draft.selectedPanel = lastSelectedPanel.current;
            });
          }}
        />
      </View>
    );
  }

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
        onPress={() => switchTo(DebuggerPanel.Network)}
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
        onPress={() => switchTo(DebuggerPanel.Console)}
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
