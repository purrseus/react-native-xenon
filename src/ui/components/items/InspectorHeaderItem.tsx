import { Image, StyleSheet, Text, TouchableOpacity, type ImageRequireSource } from 'react-native';

interface InspectorHeaderItemProps {
  content?: ImageRequireSource | string;
  isLabel?: boolean;
  isActive?: boolean;
  onPress: () => void;
}

export default function InspectorHeaderItem(props: InspectorHeaderItemProps) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={0.8}
      style={[
        styles.container,
        props.isLabel
          ? props.isActive
            ? styles.activeLabelContainer
            : styles.labelContainer
          : props.isActive
            ? styles.activeContainer
            : undefined,
      ]}
    >
      {typeof props.content === 'string' ? (
        <Text style={styles.title}>{props.content}</Text>
      ) : (
        <Image source={props.content} style={styles.icon} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#888888',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  labelContainer: {
    backgroundColor: 'transparent',
  },
  activeLabelContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#000000',
  },
  activeContainer: {
    backgroundColor: '#ef4444',
  },
  title: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '500',
    color: '#000000',
  },
  icon: {
    width: 17,
    height: 17,
  },
});
