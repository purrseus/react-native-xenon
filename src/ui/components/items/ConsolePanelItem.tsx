import { StyleSheet, Text } from 'react-native';
import { formatLogMessage, getConsoleTypeColor } from '../../../core/utils';
import colors from '../../../theme/colors';
import type { LogMessage } from '../../../types';
import Touchable from '../common/Touchable';

interface ConsolePanelItemProps extends LogMessage {
  onPress: () => void;
}

export default function ConsolePanelItem({ type, values, onPress }: ConsolePanelItemProps) {
  return (
    <Touchable
      onPress={onPress}
      style={[styles.container, { backgroundColor: getConsoleTypeColor(type) }]}
    >
      <Text numberOfLines={1} style={styles.text}>
        {formatLogMessage(values)}
      </Text>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
  },
  text: {
    color: colors.black,
    fontSize: 14,
  },
});
