import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { NetworkTab } from '../../../types';

interface NetworkDetailsHeaderItemProps {
  visible: boolean;
  isSelected: boolean;
  name: NetworkTab;
  label: string;
  onPress: () => void;
}

export default function NetworkDetailsHeaderItem({
  visible,
  name,
  isSelected,
  label,
  onPress,
}: NetworkDetailsHeaderItemProps) {
  if (!visible) return null;

  return (
    <TouchableOpacity
      key={name}
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
    borderColor: '#000000',
  },
  itemText: {
    fontSize: 14,
    color: '#000000',
  },
});
