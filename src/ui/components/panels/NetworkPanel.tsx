import { useCallback, useContext } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItem } from 'react-native';
import { MainContext } from '../../../contexts';
import { useScrollToBottom } from '../../../hooks';
import { NetworkType, type HttpRequest, type ID, type WebSocketRequest } from '../../../types';
import NetworkPanelHeader from '../headers/NetworkPanelHeader';
import NetworkPanelItem from '../items/NetworkPanelItem';
import colors from '../../../colors';

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
      const isWebSocket = item.type === NetworkType.WS;

      const onPress = () => {
        detailsData.current = { network: item };
        setPanelSelected(null);
      };

      return (
        <NetworkPanelItem
          method={isWebSocket ? undefined : item.method}
          name={item.url}
          duration={item.duration}
          status={item.status}
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
    backgroundColor: colors.gray,
  },
});
