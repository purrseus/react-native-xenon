import { StyleSheet, Text, type ImageRequireSource } from 'react-native';
import colors from '../../../theme/colors';
import Icon from '../common/Icon';
import Touchable from '../common/Touchable';

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
    <Touchable
      onPress={onPress}
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
        <Icon source={content} size={18} />
      )}
    </Touchable>
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
    lineHeight: 18,
    fontWeight: '600',
    color: colors.black,
  },
});
