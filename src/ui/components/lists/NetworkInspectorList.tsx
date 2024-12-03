import { useCallback, useContext } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItem } from 'react-native';
import { useScrollToBottom } from '../../../hooks';
import { NetworkType, type HttpRecord, type ID, type WebSocketRecord } from '../../../types';
import InspectorContext from '../../contexts/InspectorContext';
import NetworkInspectorListHeader from '../header/NetworkInspectorListHeader';
import NetworkInspectorItem from '../items/NetworkInspectorItem';

const Separator = () => <View style={styles.divider} />;

export default function NetworkInspectorList() {
  const {
    networkInterceptor: { networkRecords },
    setPanelSelected,
    detailsData,
  } = useContext(InspectorContext)!;

  const listRef = useScrollToBottom(networkRecords.size);

  const renderItem = useCallback<ListRenderItem<[NonNullable<ID>, HttpRecord | WebSocketRecord]>>(
    ({ item: [_, item] }) => {
      return (
        <NetworkInspectorItem
          name={item.type === NetworkType.WS ? item.uri : item.url}
          status={item.status}
          type={item.type}
          onPress={() => {
            detailsData.current = { network: item };
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
      data={Array.from(networkRecords)}
      style={styles.container}
      ListHeaderComponent={NetworkInspectorListHeader}
      stickyHeaderIndices={[0]}
      ItemSeparatorComponent={Separator}
      keyExtractor={([key]) => key}
      renderItem={renderItem}
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
