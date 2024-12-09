import { useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Context from '../../Context';
import DebuggerHeaderItem from '../items/DebuggerHeaderItem';

export default function DebuggerHeader() {
  const {
    setDebuggerVisibility,
    setDebuggerPosition,
    panelSelected,
    setPanelSelected,
    networkInterceptor,
    logInterceptor,
  } = useContext(Context)!;

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

  const switchToNetwork = () => {
    setPanelSelected('network');
  };

  const switchToLog = () => {
    setPanelSelected('log');
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
        isActive={panelSelected === 'network'}
        content="Network Panel"
        onPress={switchToNetwork}
      />

      <DebuggerHeaderItem
        onPress={toggleNetworkInterception}
        isActive={networkInterceptor.isInterceptorEnabled}
        content={require('../../../assets/record.png')}
      />

      <DebuggerHeaderItem
        onPress={networkInterceptor.clearAllRecords}
        content={require('../../../assets/delete.png')}
      />

      <View style={styles.divider} />

      <DebuggerHeaderItem
        isLabel
        isActive={panelSelected === 'log'}
        content="Log Panel"
        onPress={switchToLog}
      />

      <DebuggerHeaderItem
        onPress={toggleLogInterception}
        isActive={logInterceptor.isInterceptorEnabled}
        content={require('../../../assets/record.png')}
      />

      <DebuggerHeaderItem
        onPress={logInterceptor.clearAllRecords}
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
