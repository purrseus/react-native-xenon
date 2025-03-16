import { ScrollView, StyleSheet, Text } from 'react-native';
import { formatLogMessage, getConsoleTypeColor } from '../../../core/utils';
import type { LogMessage } from '../../../types';
import colors from '../../../theme/colors';

interface LogMessageDetailsProps {
  item: LogMessage;
}

export default function LogMessageDetails({ item }: LogMessageDetailsProps) {
  return (
    <ScrollView style={[styles.container, { backgroundColor: getConsoleTypeColor(item.type) }]}>
      <Text style={styles.text}>{formatLogMessage(item.values)}</Text>
    </ScrollView>
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
