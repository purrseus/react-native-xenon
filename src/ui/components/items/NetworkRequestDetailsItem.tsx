import { StyleSheet, Text, type TextProps } from 'react-native';
import colors from '../../../colors';

interface NetworkRequestDetailsItemProps extends TextProps {
  label?: string;
  content?: string;
}

export default function NetworkRequestDetailsItem({
  label,
  content,
  style,
  ...props
}: NetworkRequestDetailsItemProps) {
  if (label) {
    return (
      <Text {...props} style={[styles.text, style]}>
        <Text style={styles.label}>
          {label}
          {': '}
        </Text>
        {content}
      </Text>
    );
  }

  return (
    <Text {...props} style={[styles.text, style]}>
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
