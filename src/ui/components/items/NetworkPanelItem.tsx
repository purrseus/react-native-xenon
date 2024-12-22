import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { URL } from 'react-native-url-polyfill';
import type { HttpRequest, NetworkRequest } from '../../../types';
import {
  formatRequestDuration,
  formatRequestMethod,
  formatRequestStatusCode,
} from '../../../utils';
import colors from '../../../colors';

interface NetworkPanelItemProps {
  method?: HttpRequest['method'];
  name: NetworkRequest['url'];
  duration?: NetworkRequest['duration'];
  status?: NetworkRequest['status'];
  onPress: () => void;
}

export default function NetworkPanelItem({
  method,
  name,
  duration,
  status,
  onPress,
}: NetworkPanelItemProps) {
  const requestName = useMemo(() => {
    if (!name) return '[failed]';

    try {
      const url = new URL(name);
      const suffixUrl = url.pathname + url.search;

      if (suffixUrl === '/') return url.host;
      return suffixUrl;
    } catch (error) {
      return name;
    }
  }, [name]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.column}>
        <Text numberOfLines={1} style={styles.text}>
          {formatRequestMethod(method)}
        </Text>
      </View>

      <View style={[styles.column, styles.nameColumn]}>
        <Text numberOfLines={1} style={styles.text}>
          {requestName}
        </Text>
      </View>

      <View style={[styles.column, styles.durationColumn]}>
        <Text numberOfLines={1} style={styles.text}>
          {formatRequestDuration(duration)}
        </Text>
      </View>

      <View style={styles.column}>
        <Text numberOfLines={1} style={styles.text}>
          {formatRequestStatusCode(status)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  nameColumn: {
    flex: 5,
  },
  durationColumn: {
    flex: 2,
  },
  column: {
    flex: 1.5,
    flexShrink: 1,
    padding: 8,
    paddingRight: 0,
  },
  text: {
    color: colors.black,
    fontSize: 14,
  },
});
