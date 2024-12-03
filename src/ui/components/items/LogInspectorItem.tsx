import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { LogRecord } from '../../../types';
import { formatLog } from '../../../utils';

interface LogInspectorItemProps extends LogRecord {
  onPress: () => void;
}

export default function LogInspectorItem({ type, values, onPress }: LogInspectorItemProps) {
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
