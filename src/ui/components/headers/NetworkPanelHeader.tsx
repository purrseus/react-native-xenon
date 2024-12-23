import { StyleSheet, Text, View } from 'react-native';
import colors from '../../../colors';

export default function NetworkPanelHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.headerColumn}>
        <Text numberOfLines={1} style={styles.itemText}>
          Method
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={[styles.headerColumn, styles.headerNameColumn]}>
        <Text numberOfLines={1} style={styles.itemText}>
          Name
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={[styles.headerColumn, styles.headerDurationColumn]}>
        <Text numberOfLines={1} style={styles.itemText}>
          Duration
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.headerColumn}>
        <Text numberOfLines={1} style={styles.itemText}>
          Status
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray,
    borderRadius: 4,
  },
  headerNameColumn: {
    flex: 5,
  },
  headerDurationColumn: {
    flex: 2,
  },
  headerColumn: {
    flex: 1.5,
    flexShrink: 1,
    paddingVertical: 4,
    paddingLeft: 8,
  },
  divider: {
    height: 16,
    width: 1,
    backgroundColor: colors.gray,
  },
  itemText: {
    fontSize: 14,
    color: colors.black,
  },
});
