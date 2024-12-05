import { useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import InspectorContext from '../../contexts/InspectorContext';
import InspectorHeaderItem from '../items/InspectorHeaderItem';

export default function InspectorHeader() {
  const {
    setInspectorVisibility,
    setInspectorPosition,
    panelSelected,
    setPanelSelected,
    networkInterceptor,
    logInterceptor,
  } = useContext(InspectorContext)!;

  const hideInspectorPanel = () => {
    setInspectorVisibility('bubble');
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

  const toggleInspectorPosition = () => {
    setInspectorPosition(prevState => (prevState === 'bottom' ? 'top' : 'bottom'));
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
      <InspectorHeaderItem
        onPress={hideInspectorPanel}
        content={require('../../../assets/hide.png')}
      />

      <InspectorHeaderItem
        onPress={toggleInspectorPosition}
        content={require('../../../assets/move.png')}
      />

      <InspectorHeaderItem
        isLabel
        isActive={panelSelected === 'network'}
        content="Network Panel"
        onPress={switchToNetwork}
      />

      <InspectorHeaderItem
        onPress={toggleNetworkInterception}
        isActive={networkInterceptor.isInterceptorEnabled}
        content={require('../../../assets/record.png')}
      />

      <InspectorHeaderItem
        onPress={networkInterceptor.clearAllRecords}
        content={require('../../../assets/delete.png')}
      />

      <View style={styles.divider} />

      <InspectorHeaderItem
        isLabel
        isActive={panelSelected === 'log'}
        content="Log Panel"
        onPress={switchToLog}
      />

      <InspectorHeaderItem
        onPress={toggleLogInterception}
        isActive={logInterceptor.isInterceptorEnabled}
        content={require('../../../assets/record.png')}
      />

      <InspectorHeaderItem
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
