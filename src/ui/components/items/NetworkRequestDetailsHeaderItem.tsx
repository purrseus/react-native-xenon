import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../../../theme/colors';

interface NetworkRequestDetailsHeaderItemProps {
  visible: boolean;
  isSelected: boolean;
  label: string;
  onPress: () => void;
}

export default function NetworkRequestDetailsHeaderItem({
  visible,
  isSelected,
  label,
  onPress,
}: NetworkRequestDetailsHeaderItemProps) {
  if (!visible) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.item, isSelected && styles.activeItem]}
    >
      <Text style={styles.itemText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeItem: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.black,
  },
  itemText: {
    fontSize: 14,
    color: colors.black,
  },
});
