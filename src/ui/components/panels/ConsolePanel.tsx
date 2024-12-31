import { useCallback, useContext } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItem } from 'react-native';
import colors from '../../../colors';
import { MainContext } from '../../../contexts';
import type { LogMessage } from '../../../types';
import ConsolePanelItem from '../items/ConsolePanelItem';
import { detailsData } from '../../../data';

const Separator = () => <View style={styles.divider} />;

export default function ConsolePanel() {
  const {
    logInterceptor: { logMessages },
    setDebuggerState,
  } = useContext(MainContext)!;

  const renderItem = useCallback<ListRenderItem<LogMessage>>(
    ({ item }) => (
      <ConsolePanelItem
        {...item}
        onPress={() => {
          detailsData.value = { console: item };
          setDebuggerState(draft => {
            draft.selectedPanel = null;
          });
        }}
      />
    ),
    [setDebuggerState],
  );

  return (
    <FlatList
      inverted
      data={logMessages.toReversed()}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
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
    height: 1,
    backgroundColor: colors.gray,
  },
});
