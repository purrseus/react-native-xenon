import { useCallback, useContext, useMemo, type Ref } from 'react';
import {
  FlatList,
  StyleSheet,
  type ListRenderItem,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { MainContext } from '../../../contexts';
import { CONSOLE_ITEM_HEIGHT } from '../../../core/constants';
import { formatLogMessage } from '../../../core/utils';
import { DebuggerPanel, type LogMessage } from '../../../types';
import Empty from '../common/Empty';
import ConsolePanelItem from '../items/ConsolePanelItem';

interface ConsolePanelProps {
  style?: StyleProp<ViewStyle>;
  ref?: Ref<FlatList<any>>;
}

export default function ConsolePanel({ style, ref }: ConsolePanelProps) {
  const {
    debuggerState: { searchQuery },
    consoleInterceptor: { logMessages },
    setDebuggerState,
  } = useContext(MainContext)!;

  const data = useMemo(() => {
    let result = [...logMessages];

    if (searchQuery) {
      result = logMessages.filter(item =>
        formatLogMessage(item?.values ?? [])
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      );
    }

    return result.reverse();
  }, [logMessages, searchQuery]);

  const renderItem = useCallback<ListRenderItem<LogMessage>>(
    ({ item }) => (
      <ConsolePanelItem
        {...item}
        onPress={() => {
          setDebuggerState(draft => {
            draft.detailsData = {
              type: DebuggerPanel.Console,
              data: item,
              selectedTab: 'logMessage',
              beautified: false,
            };
          });
        }}
      />
    ),
    [setDebuggerState],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<LogMessage> | null | undefined, index: number) => ({
      length: CONSOLE_ITEM_HEIGHT,
      offset: CONSOLE_ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  return (
    <FlatList
      ref={ref}
      inverted={!!data.length}
      data={data}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      style={[styles.container, style]}
      contentContainerStyle={data.length ? styles.contentContainer : undefined}
      ListEmptyComponent={<Empty>No logs yet</Empty>}
      getItemLayout={getItemLayout}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 8,
  },
});
