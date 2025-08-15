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
import { DebuggerPanel, type LogMessage } from '../../../types';
import ConsolePanelItem from '../items/ConsolePanelItem';
import refs, { HeaderState, PanelState } from '../../../core/refs';
import { formatLogMessage } from '../../../core/utils';

const Separator = () => <View style={styles.divider} />;

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
          refs.header.current?.setCurrentIndex(HeaderState.Console);
          refs.panel.current?.setCurrentIndex(PanelState.ConsoleDetail);
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
      inverted
      data={data}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      ItemSeparatorComponent={Separator}
      style={[styles.container, style]}
      contentContainerStyle={styles.contentContainer}
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
  divider: {
    height: 4,
  },
});

export default ConsolePanel;
