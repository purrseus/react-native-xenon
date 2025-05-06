import { ScrollView, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { formatLogMessage, getConsoleTypeColor } from '../../../core/utils';
import type { LogMessage } from '../../../types';
import colors from '../../../theme/colors';
import { forwardRef, useContext } from 'react';
import { MainContext } from '../../../contexts';

const LogMessageDetails = forwardRef<ScrollView, { style?: StyleProp<ViewStyle> }>(
  ({ style }, ref) => {
    const {
      debuggerState: { detailsData },
    } = useContext(MainContext)!;

    const item = detailsData?.data as LogMessage | undefined;

    return (
      <ScrollView
        ref={ref}
        style={[
          styles.container,
          { backgroundColor: getConsoleTypeColor(item?.type ?? '') },
          style,
        ]}
      >
        <Text style={styles.text}>{formatLogMessage(item?.values ?? [])}</Text>
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  text: {
    color: colors.black,
    fontSize: 14,
  },
});

export default LogMessageDetails;
