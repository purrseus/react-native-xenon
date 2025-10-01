import { forwardRef, useCallback, useContext, useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  type ListRenderItem,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { MainContext } from '../../../contexts';
import { formatLogMessage } from '../../../core/utils';
import { DebuggerPanel, type LogMessage } from '../../../types';
import Empty from '../common/Empty';
import ConsolePanelItem from '../items/ConsolePanelItem';

const Separator = () => <View style={styles.spacing} />;

const ConsolePanel = forwardRef<FlatList, { style?: StyleProp<ViewStyle> }>(({ style }, ref) => {
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

  return (
    <FlatList
      ref={ref}
      inverted={!!data.length}
      data={data}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      ItemSeparatorComponent={Separator}
      style={[styles.container, style]}
      contentContainerStyle={data.length ? styles.contentContainer : undefined}
      ListEmptyComponent={<Empty>No logs yet</Empty>}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 8,
  },
  spacing: {
    height: 4,
  },
});

export default ConsolePanel;
