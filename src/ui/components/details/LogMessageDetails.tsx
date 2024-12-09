import { ScrollView, StyleSheet, Text } from 'react-native';
import type { LogRecord } from '../../../types';
import { formatLog } from '../../../utils';

interface LogMessageDetailsProps {
  item: LogRecord;
}

export default function LogMessageDetails({ item }: LogMessageDetailsProps) {
  return (
    <ScrollView style={styles.container}>
      <Text>{formatLog(item.type, item.values)}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#888888',
  },
});
