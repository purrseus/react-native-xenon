import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { URL } from 'react-native-url-polyfill';
import { NETWORK_ITEM_HEIGHT } from '../../../core/constants';
import {
  formatRequestDuration,
  formatRequestMethod,
  formatRequestStatusCode,
} from '../../../core/utils';
import colors from '../../../theme/colors';
import type { HttpRequest, NetworkRequest } from '../../../types';
import Divider from '../common/Divider';
import Touchable from '../common/Touchable';

interface NetworkPanelItemProps {
  method?: HttpRequest['method'];
  name: NetworkRequest['url'];
  startTime?: NetworkRequest['startTime'];
  endTime?: NetworkRequest['endTime'];
  status?: NetworkRequest['status'];
  onPress: () => void;
}

const getMethodColor = (method: string) => {
  switch (method) {
    case 'GET':
      return colors.blue;
    case 'POST':
      return colors.green;
    case 'PUT':
      return colors.yellow;
    case 'PATCH':
      return colors.cyan;
    case 'DELETE':
      return colors.red;
    case 'OPTIONS':
    case 'HEAD':
      return colors.purple;
    default:
      return colors.black;
  }
};

const NetworkPanelItem = memo<NetworkPanelItemProps>(
  ({ method, name, startTime, endTime, status, onPress }) => {
    const duration = formatRequestDuration(startTime, endTime);
    const requestMethod = formatRequestMethod(method);
    const requestStatusCode = formatRequestStatusCode(status);
    const isRequestFailed = Number.isInteger(status) && status! >= 400 && status! < 600;
    const textStyle = [styles.text, isRequestFailed && styles.failedText];

    const requestPath = useMemo(() => {
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
      <View style={styles.container}>
        <Touchable onPress={onPress} style={styles.wrapper}>
          <View style={styles.column}>
            <Text
              numberOfLines={1}
              style={[
                styles.text,
                styles.methodText,
                { backgroundColor: getMethodColor(requestMethod) },
              ]}
            >
              {requestMethod}
            </Text>
          </View>

          <View style={[styles.column, styles.pathColumn]}>
            <Text numberOfLines={1} style={textStyle}>
              {requestPath}
            </Text>
          </View>

          <View style={[styles.column, styles.durationColumn]}>
            <Text numberOfLines={1} style={textStyle}>
              {duration}
            </Text>
          </View>

          <View style={styles.column}>
            <Text numberOfLines={1} style={textStyle}>
              {requestStatusCode}
            </Text>
          </View>
        </Touchable>
        <Divider type="horizontal" />
      </View>
    );
  },
  (prevProps, nextProps) =>
    prevProps.method === nextProps.method &&
    prevProps.name === nextProps.name &&
    prevProps.startTime === nextProps.startTime &&
    prevProps.endTime === nextProps.endTime &&
    prevProps.status === nextProps.status,
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: NETWORK_ITEM_HEIGHT,
    columnGap: 8,
  },
  pathColumn: {
    flex: 5,
  },
  durationColumn: {
    flex: 2,
  },
  column: {
    flex: 1.5,
    flexShrink: 1,
  },
  failedText: {
    color: colors.red,
  },
  text: {
    color: colors.black,
    fontSize: 14,
  },
  methodText: {
    borderRadius: 4,
    color: colors.lightGray,
    paddingVertical: 4,
    paddingHorizontal: 2,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default NetworkPanelItem;
