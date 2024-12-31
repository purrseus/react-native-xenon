import { useCallback, useContext, useMemo } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItem } from 'react-native';
import colors from '../../../colors';
import { MainContext } from '../../../contexts';
import { NetworkType, type HttpRequest, type ID, type WebSocketRequest } from '../../../types';
import NetworkPanelHeader from '../headers/NetworkPanelHeader';
import NetworkPanelItem from '../items/NetworkPanelItem';
import { detailsData } from '../../../data';

const Separator = () => <View style={styles.divider} />;

export default function NetworkPanel() {
  const {
    networkInterceptor: { networkRequests },
    setDebuggerState,
  } = useContext(MainContext)!;

  const data = useMemo(() => Array.from(networkRequests).reverse(), [networkRequests]);

  const renderItem = useCallback<ListRenderItem<[NonNullable<ID>, HttpRequest | WebSocketRequest]>>(
    ({ item: [_, item] }) => (
      <NetworkPanelItem
        method={item.type === NetworkType.WS ? undefined : item.method}
        name={item.url}
        duration={item.duration}
        status={item.status}
        onPress={() => {
          detailsData.value = { network: item };
          setDebuggerState(draft => {
            draft.selectedPanel = null;
          });
        }}
      />
    ),
    [setDebuggerState],
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
