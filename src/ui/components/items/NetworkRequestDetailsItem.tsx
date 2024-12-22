import { StyleSheet, Text } from 'react-native';
import colors from '../../../colors';

interface NetworkRequestDetailsItemProps {
  label?: string;
  content?: string;
  selectable?: boolean;
}

export default function NetworkRequestDetailsItem({
  label,
  content,
  selectable,
}: NetworkRequestDetailsItemProps) {
  if (label) {
    return (
      <Text style={styles.text} selectable={selectable}>
        <Text style={styles.label}>
          {label}
          {': '}
        </Text>
        {content}
      </Text>
    );
  }

  return (
    <Text style={styles.text} selectable={selectable}>
      {content}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: colors.black,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
  },
});
