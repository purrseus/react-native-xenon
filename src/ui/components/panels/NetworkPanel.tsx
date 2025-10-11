import { forwardRef, useCallback, useContext, useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  type ListRenderItem,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { MainContext } from '../../../contexts';
import { NETWORK_ITEM_HEIGHT } from '../../../core/constants';
import {
  DebuggerPanel,
  NetworkType,
  type HttpRequest,
  type ID,
  type WebSocketRequest,
} from '../../../types';
import Empty from '../common/Empty';
import NetworkPanelItem from '../items/NetworkPanelItem';

const NetworkPanel = forwardRef<FlatList, { style?: StyleProp<ViewStyle> }>(({ style }, ref) => {
  const {
    debuggerState: { searchQuery },
    networkInterceptor: { networkRequests },
    setDebuggerState,
  } = useContext(MainContext)!;

  const data = useMemo(() => {
    let result = Array.from(networkRequests);

    if (searchQuery) {
      result = result.filter(([, item]) =>
        (item as HttpRequest | WebSocketRequest).url
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      );
    }

    return result.reverse();
  }, [networkRequests, searchQuery]);

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

  const getItemLayout = useCallback(
    (
      _: ArrayLike<[NonNullable<ID>, HttpRequest | WebSocketRequest]> | null | undefined,
      index: number,
    ) => ({
      length: NETWORK_ITEM_HEIGHT,
      offset: NETWORK_ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  return (
    <FlatList
      inverted={!!data.length}
      data={data}
      ref={ref}
      renderItem={renderItem}
      keyExtractor={([key]) => key}
      style={[styles.container, style]}
      ListEmptyComponent={<Empty>No records yet</Empty>}
      getItemLayout={getItemLayout}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
  },
});

export default NetworkPanel;
