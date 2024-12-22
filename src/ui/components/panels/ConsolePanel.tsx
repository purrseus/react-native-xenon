import { useCallback, useContext } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItem } from 'react-native';
import { MainContext } from '../../../contexts';
import { useScrollToBottom } from '../../../hooks';
import type { LogMessage } from '../../../types';
import ConsolePanelItem from '../items/ConsolePanelItem';
import colors from '../../../colors';

const Separator = () => <View style={styles.divider} />;

export default function ConsolePanel() {
  const {
    logInterceptor: { logMessages },
    setPanelSelected,
    detailsData,
  } = useContext(MainContext)!;

  const listRef = useScrollToBottom(logMessages.length);

  const renderItem = useCallback<ListRenderItem<LogMessage>>(
    ({ item }) => {
      return (
        <ConsolePanelItem
          {...item}
          onPress={() => {
            detailsData.current = { console: item };
            setPanelSelected(null);
          }}
        />
      );
    },
    [detailsData, setPanelSelected],
  );

  return (
    <FlatList
      ref={listRef}
      style={styles.container}
      data={logMessages}
      renderItem={renderItem}
      ItemSeparatorComponent={Separator}
      keyExtractor={(_, index) => index.toString()}
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
