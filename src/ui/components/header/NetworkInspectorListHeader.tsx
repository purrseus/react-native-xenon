import { StyleSheet, Text, View } from 'react-native';

export default function NetworkInspectorListHeader() {
  return (
    <View style={styles.container}>
      <View style={[styles.headerColumn, styles.headerMainColumn]}>
        <Text style={styles.itemText}>Name</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.headerColumn}>
        <Text style={styles.itemText}>Status</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.headerColumn}>
        <Text style={styles.itemText}>Type</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#888888',
    borderRadius: 4,
  },
  headerMainColumn: {
    flex: 7,
    flexShrink: 1,
  },
  headerColumn: {
    flex: 1.5,
    flexShrink: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  divider: {
    height: 16,
    width: 1,
    backgroundColor: '#888888',
  },
  itemText: {
    fontSize: 14,
    color: '#000000',
  },
});
