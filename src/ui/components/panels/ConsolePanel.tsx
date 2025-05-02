import { forwardRef, useCallback, useContext } from 'react';
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

const Separator = () => <View style={styles.divider} />;

const ConsolePanel = forwardRef<FlatList, { style?: StyleProp<ViewStyle> }>(({ style }, ref) => {
  const {
    consoleInterceptor: { logMessages },
    setDebuggerState,
  } = useContext(MainContext)!;

  const renderItem = useCallback<ListRenderItem<LogMessage>>(
    ({ item }) => (
      <ConsolePanelItem
        {...item}
        onPress={() => {
          refs.panel.current?.setCurrentIndex(PanelState.Details);
          refs.header.current?.setCurrentIndex(HeaderState.Console);
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
      data={[...logMessages].reverse()}
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
