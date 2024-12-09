import { useCallback, useContext } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItem } from 'react-native';
import { MainContext } from '../../../contexts';
import { useScrollToBottom } from '../../../hooks';
import { NetworkType, type HttpRequest, type ID, type WebSocketRequest } from '../../../types';
import NetworkPanelHeader from '../header/NetworkPanelHeader';
import NetworkPanelItem from '../items/NetworkPanelItem';

const Separator = () => <View style={styles.divider} />;

export default function NetworkPanel() {
  const {
    networkInterceptor: { networkRequests },
    setPanelSelected,
    detailsData,
  } = useContext(MainContext)!;

  const listRef = useScrollToBottom(networkRequests.size);

  const renderItem = useCallback<ListRenderItem<[NonNullable<ID>, HttpRequest | WebSocketRequest]>>(
    ({ item: [_, item] }) => {
      const onPress = () => {
        detailsData.current = { network: item };
        setPanelSelected(null);
      };

      return (
        <NetworkPanelItem
          name={item.type === NetworkType.WS ? item.uri : item.url}
          status={item.status}
          type={item.type}
          onPress={onPress}
        />
      );
    },
    [detailsData, setPanelSelected],
  );

  return (
    <FlatList
      ref={listRef}
      data={Array.from(networkRequests)}
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
