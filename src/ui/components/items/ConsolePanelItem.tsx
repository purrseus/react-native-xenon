import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CONSOLE_ITEM_HEIGHT } from '../../../core/constants';
import { formatLogMessage, getConsoleTypeColor } from '../../../core/utils';
import colors from '../../../theme/colors';
import type { LogMessage } from '../../../types';
import Touchable from '../common/Touchable';

interface ConsolePanelItemProps extends LogMessage {
  onPress: () => void;
}

const ConsolePanelItem = memo<ConsolePanelItemProps>(
  ({ type, values, onPress }) => {
    return (
      <Touchable onPress={onPress} style={styles.container}>
        <View style={[styles.wrapper, { backgroundColor: getConsoleTypeColor(type) }]}>
          <Text numberOfLines={1} style={styles.text}>
            {formatLogMessage(values)}
          </Text>
        </View>
      </Touchable>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.type === nextProps.type && prevProps.values === nextProps.values;
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 4,
    height: CONSOLE_ITEM_HEIGHT,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderRadius: 8,
  },
  text: {
    color: colors.black,
    fontSize: 14,
  },
});

export default ConsolePanelItem;
