import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { LogMessage } from '../../../types';
import { formatLogMessage } from '../../../core/utils';
import colors from '../../../theme/colors';

interface ConsolePanelItemProps extends LogMessage {
  onPress: () => void;
}

export default function ConsolePanelItem({ type, values, onPress }: ConsolePanelItemProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text numberOfLines={1} style={styles.text}>
        {formatLogMessage(type, values)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  text: {
    color: colors.black,
    fontSize: 14,
  },
});
