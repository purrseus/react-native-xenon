import { StyleSheet, Text } from 'react-native';
import colors from '../../../theme/colors';

interface NetworkRequestDetailsItemProps {
  label: string;
  content: string | [string, string][];
}

export default function NetworkRequestDetailsItem({
  label,
  content,
}: NetworkRequestDetailsItemProps) {
  return (
    <Text style={styles.text}>
      <Text style={styles.label}>
        {label}
        {'\n'}
      </Text>
      {typeof content === 'string'
        ? content
        : content.map(([key, value]) => (
            <Text key={key} style={[styles.label, styles.subLabel]}>
              {key}
              {': '}
              <Text style={styles.text}>{value}</Text>
              {'\n'}
            </Text>
          ))}
      {Array.isArray(content) || content?.endsWith('\n') ? '' : '\n'}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontWeight: 'normal',
    color: colors.black,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  subLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
