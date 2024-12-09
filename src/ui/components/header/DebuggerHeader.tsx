import { useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { MainContext } from '../../../contexts';
import { DebuggerPanel } from '../../../types';
import DebuggerHeaderItem from '../items/DebuggerHeaderItem';

export default function DebuggerHeader() {
  const {
    setDebuggerVisibility,
    setDebuggerPosition,
    panelSelected,
    setPanelSelected,
    networkInterceptor,
    logInterceptor,
  } = useContext(MainContext)!;

  const hideDebugger = () => {
    setDebuggerVisibility('bubble');
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
    setDebuggerPosition(prevState => (prevState === 'bottom' ? 'top' : 'bottom'));
  };

  const switchToNetworkPanel = () => {
    setPanelSelected(DebuggerPanel.Network);
  };

  const switchToConsolePanel = () => {
    setPanelSelected(DebuggerPanel.Console);
  };

  return (
    <ScrollView
      horizontal
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsHorizontalScrollIndicator={false}
    >
      <DebuggerHeaderItem onPress={hideDebugger} content={require('../../../assets/hide.png')} />

      <DebuggerHeaderItem
        onPress={toggleDebuggerPosition}
        content={require('../../../assets/move.png')}
      />

      <DebuggerHeaderItem
        isLabel
        isActive={panelSelected === DebuggerPanel.Network}
        content="Network Panel"
        onPress={switchToNetworkPanel}
      />

      <DebuggerHeaderItem
        onPress={toggleNetworkInterception}
        isActive={networkInterceptor.isInterceptorEnabled}
        content={require('../../../assets/record.png')}
      />

      <DebuggerHeaderItem
        onPress={networkInterceptor.clearAllNetworkRequests}
        content={require('../../../assets/delete.png')}
      />

      <View style={styles.divider} />

      <DebuggerHeaderItem
        isLabel
        isActive={panelSelected === DebuggerPanel.Console}
        content="Log Panel"
        onPress={switchToConsolePanel}
      />

      <DebuggerHeaderItem
        onPress={toggleLogInterception}
        isActive={logInterceptor.isInterceptorEnabled}
        content={require('../../../assets/record.png')}
      />

      <DebuggerHeaderItem
        onPress={logInterceptor.clearAllLogMessages}
        content={require('../../../assets/delete.png')}
      />
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
    backgroundColor: '#888888',
  },
});
