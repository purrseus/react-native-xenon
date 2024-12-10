import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { LogMessage } from '../../../types';
import { formatLogMessage } from '../../../utils';

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
    color: '#000000',
    fontSize: 14,
  },
});
