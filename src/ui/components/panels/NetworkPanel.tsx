import { forwardRef, useCallback, useContext, useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  type ListRenderItem,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { MainContext } from '../../../contexts';
import refs, { HeaderState, PanelState } from '../../../core/refs';
import {
  DebuggerPanel,
  NetworkType,
  type HttpRequest,
  type ID,
  type WebSocketRequest,
} from '../../../types';
import Divider from '../common/Divider';
import NetworkPanelItem from '../items/NetworkPanelItem';

const Separator = () => <Divider type="horizontal" />;

const NetworkPanel = forwardRef<FlatList, { style?: StyleProp<ViewStyle> }>(({ style }, ref) => {
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
          refs.panel.current?.setCurrentIndex(PanelState.Details);
          refs.header.current?.setCurrentIndex(HeaderState.Network);
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

  return (
    <FlatList
      inverted
      data={data}
      ref={ref}
      renderItem={renderItem}
      keyExtractor={([key]) => key}
      ItemSeparatorComponent={Separator}
      style={[styles.container, style]}
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
