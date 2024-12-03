import { useCallback, useContext } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItem } from 'react-native';
import { useScrollToBottom } from '../../../hooks';
import type { LogRecord } from '../../../types';
import InspectorContext from '../../contexts/InspectorContext';
import LogInspectorItem from '../items/LogInspectorItem';

const Separator = () => <View style={styles.divider} />;

export default function LogInspectorList() {
  const {
    logInterceptor: { logRecords },
    setPanelSelected,
    detailsData,
  } = useContext(InspectorContext)!;

  const listRef = useScrollToBottom(logRecords.length);

  const renderItem = useCallback<ListRenderItem<LogRecord>>(
    ({ item }) => {
      return (
        <LogInspectorItem
          {...item}
          onPress={() => {
            detailsData.current = { log: item };
            setPanelSelected(null);
          }}
        />
      );
    },
    [detailsData, setPanelSelected],
  );

  return (
    <FlatList
      ref={listRef}
      style={styles.container}
      data={logRecords}
      renderItem={renderItem}
      ItemSeparatorComponent={Separator}
      keyExtractor={(_, index) => index.toString()}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#888888',
  },
});
