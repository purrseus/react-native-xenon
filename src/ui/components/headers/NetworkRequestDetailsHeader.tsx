import { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import type { NetworkTab } from '../../../types';
import NetworkRequestDetailsHeaderItem from '../items/NetworkRequestDetailsHeaderItem';

interface NetworkDetailsHeaderProps {
  selectedTab: NetworkTab;
  onChangeTab: (tab: NetworkTab) => void;
  headersShown?: boolean;
  queryStringParametersShown?: boolean;
  bodyShown?: boolean;
  responseShown?: boolean;
  messagesShown?: boolean;
}

interface HeaderItem {
  visible: boolean;
  name: NetworkTab;
  label: string;
}

export default function NetworkDetailsHeader({
  selectedTab,
  onChangeTab,
  headersShown = true,
  queryStringParametersShown = true,
  bodyShown = true,
  responseShown = true,
  messagesShown = true,
}: NetworkDetailsHeaderProps) {
  const data = useMemo<HeaderItem[]>(
    () => [
      {
        visible: headersShown,
        name: 'headers',
        label: 'Headers',
      },
      {
        visible: queryStringParametersShown,
        name: 'queryStringParameters',
        label: 'Query String Parameters',
      },
      {
        visible: bodyShown,
        name: 'body',
        label: 'Body',
      },
      {
        visible: responseShown,
        name: 'response',
        label: 'Response',
      },
      {
        visible: messagesShown,
        name: 'messages',
        label: 'Messages',
      },
    ],
    [bodyShown, headersShown, messagesShown, queryStringParametersShown, responseShown],
  );

  return (
    <ScrollView
      horizontal
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsHorizontalScrollIndicator={false}
    >
      {data.map(item => (
        <NetworkRequestDetailsHeaderItem
          key={item.name}
          onPress={() => onChangeTab(item.name)}
          isSelected={item.name === selectedTab}
          visible={item.visible}
          label={item.label}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  contentContainer: {
    paddingHorizontal: 8,
    columnGap: 8,
  },
});
