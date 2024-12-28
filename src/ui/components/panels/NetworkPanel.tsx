import { useCallback, useContext, useMemo } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItem } from 'react-native';
import colors from '../../../colors';
import { MainContext } from '../../../contexts';
import { NetworkType, type HttpRequest, type ID, type WebSocketRequest } from '../../../types';
import NetworkPanelHeader from '../headers/NetworkPanelHeader';
import NetworkPanelItem from '../items/NetworkPanelItem';

const Separator = () => <View style={styles.divider} />;

export default function NetworkPanel() {
  const {
    networkInterceptor: { networkRequests },
    setPanelSelected,
    detailsData,
  } = useContext(MainContext)!;

  const data = useMemo(() => Array.from(networkRequests).reverse(), [networkRequests]);

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
    <>
      <NetworkPanelHeader />
      <FlatList
        inverted
        data={data}
        renderItem={renderItem}
        keyExtractor={([key]) => key}
        ItemSeparatorComponent={Separator}
        style={styles.container}
      />
    </>
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
