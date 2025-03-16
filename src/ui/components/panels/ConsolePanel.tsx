import { useCallback, useContext } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItem } from 'react-native';
import { MainContext } from '../../../contexts';
import { DebuggerPanel, type LogMessage } from '../../../types';
import ConsolePanelItem from '../items/ConsolePanelItem';

const Separator = () => <View style={styles.divider} />;

export default function ConsolePanel() {
  const {
    consoleInterceptor: { logMessages },
    setDebuggerState,
  } = useContext(MainContext)!;

  const renderItem = useCallback<ListRenderItem<LogMessage>>(
    ({ item }) => (
      <ConsolePanelItem
        {...item}
        onPress={() => {
          setDebuggerState(draft => {
            draft.selectedPanel = null;
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
      inverted
      data={[...logMessages].reverse()}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      ItemSeparatorComponent={Separator}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
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
  divider: {
    height: 4,
  },
});
