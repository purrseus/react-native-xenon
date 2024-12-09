import { useCallback, useContext } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItem } from 'react-native';
import { useScrollToBottom } from '../../../hooks';
import { NetworkType, type HttpRecord, type ID, type WebSocketRecord } from '../../../types';
import Context from '../../Context';
import NetworkPanelHeader from '../header/NetworkPanelHeader';
import NetworkRequestPanelItem from '../items/NetworkRequestPanelItem';

const Separator = () => <View style={styles.divider} />;

export default function NetworkPanel() {
  const {
    networkInterceptor: { networkRecords },
    setPanelSelected,
    detailsData,
  } = useContext(Context)!;

  const listRef = useScrollToBottom(networkRecords.size);

  const renderItem = useCallback<ListRenderItem<[NonNullable<ID>, HttpRecord | WebSocketRecord]>>(
    ({ item: [_, item] }) => {
      return (
        <NetworkRequestPanelItem
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
      ListHeaderComponent={NetworkPanelHeader}
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
