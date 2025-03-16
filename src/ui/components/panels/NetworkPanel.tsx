import { useCallback, useContext, useMemo } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItem } from 'react-native';
import colors from '../../../theme/colors';
import { MainContext } from '../../../contexts';
import {
  DebuggerPanel,
  NetworkType,
  type HttpRequest,
  type ID,
  type WebSocketRequest,
} from '../../../types';
import NetworkPanelItem from '../items/NetworkPanelItem';

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
        startTime={item.startTime}
        endTime={item.endTime}
        status={item.status}
        onPress={() => {
          setDebuggerState(draft => {
            draft.selectedPanel = null;
            draft.detailsData = {
              type: DebuggerPanel.Network,
              data: item,
              selectedTab: 'overview',
              beautified: false,
            };
          });
        }}
      />
    ),
    [setDebuggerState],
  );

  return (
    <FlatList
      inverted
      data={data}
      renderItem={renderItem}
      keyExtractor={([key]) => key}
      ItemSeparatorComponent={Separator}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.gray,
  },
});
