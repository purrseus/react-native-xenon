import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { LogMessage } from '../../../types';
import { formatLog } from '../../../utils';

interface ConsolePanelItemProps extends LogMessage {
  onPress: () => void;
}

export default function ConsolePanelItem({ type, values, onPress }: ConsolePanelItemProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text numberOfLines={1} style={styles.text}>
        {formatLog(type, values)}
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
