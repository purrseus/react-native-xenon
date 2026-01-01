import { useContext, type Ref } from 'react';
import { ScrollView, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { MainContext } from '../../../contexts';
import { formatLogMessage, getConsoleTypeColor } from '../../../core/utils';
import colors from '../../../theme/colors';
import type { LogMessage } from '../../../types';

interface LogMessageDetailsProps {
  style?: StyleProp<ViewStyle>;
  ref?: Ref<ScrollView>;
}

export default function LogMessageDetails({ style, ref }: LogMessageDetailsProps) {
  const {
    debuggerState: { detailsData },
  } = useContext(MainContext)!;

  const item = detailsData?.data as LogMessage | undefined;

  return (
    <ScrollView
      ref={ref}
      style={[styles.container, { backgroundColor: getConsoleTypeColor(item?.type ?? '') }, style]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.text}>{formatLogMessage(item?.values ?? [])}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 8,
  },
  text: {
    color: colors.black,
    fontSize: 14,
  },
});
