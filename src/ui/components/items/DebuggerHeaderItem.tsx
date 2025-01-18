import { Image, StyleSheet, Text, TouchableOpacity, type ImageRequireSource } from 'react-native';
import colors from '../../../theme/colors';

interface DebuggerHeaderItemProps {
  content?: ImageRequireSource | string;
  isLabel?: boolean;
  isActive?: boolean;
  activeColor?: string;
  onPress: () => void;
}

export default function DebuggerHeaderItem({
  content,
  isLabel,
  isActive,
  activeColor = colors.red,
  onPress,
}: DebuggerHeaderItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.container,
        isLabel
          ? isActive
            ? styles.activeLabelContainer
            : styles.labelContainer
          : isActive
            ? { backgroundColor: activeColor }
            : undefined,
      ]}
    >
      {typeof content === 'string' ? (
        <Text style={styles.title}>{content}</Text>
      ) : (
        <Image source={content} style={styles.icon} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: colors.gray,
    borderWidth: 1,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    backgroundColor: 'transparent',
  },
  activeLabelContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.black,
  },
  title: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '500',
    color: colors.black,
  },
  icon: {
    width: 17,
    height: 17,
  },
});
