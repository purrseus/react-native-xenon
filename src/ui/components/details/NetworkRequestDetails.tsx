import { useContext, useRef, type JSX, type ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { MainContext } from '../../../contexts';
import {
  formatRequestDuration,
  formatRequestMethod,
  formatRequestStatusCode,
  getNetworkUtils,
  keyValueToString,
  limitChar,
} from '../../../core/utils';
import colors from '../../../theme/colors';
import { type DetailTab, type HttpRequest, type WebSocketRequest } from '../../../types';
import NetworkRequestDetailsItem from '../items/NetworkRequestDetailsItem';

interface NetworkRequestDetailsProps {
  item: HttpRequest | WebSocketRequest;
}

export default function NetworkRequestDetails({ item }: NetworkRequestDetailsProps) {
  const { debuggerState } = useContext(MainContext)!;

  const {
    isHttp,
    requestUrl,
    overviewShown,
    headersShown,
    requestShown,
    responseShown,
    messagesShown,
  } = getNetworkUtils(item);

  const content = useRef<Record<Exclude<DetailTab, 'logMessage'>, JSX.Element | null>>({
    overview: null,
    headers: null,
    request: null,
    response: null,
    messages: null,
  });

  if (overviewShown && !content.current.overview) {
    content.current.overview = (
      <>
        <NetworkRequestDetailsItem label="Request Type" content={item.type} />

        <NetworkRequestDetailsItem label="Request URL" content={item.url} />

        <NetworkRequestDetailsItem
          label="Request Method"
          content={formatRequestMethod(isHttp ? (item as HttpRequest).method : undefined)}
        />

        <NetworkRequestDetailsItem
          label="Duration"
          content={formatRequestDuration(item.duration)}
        />

        <NetworkRequestDetailsItem
          label="Status Code"
          content={formatRequestStatusCode(item.status)}
        />
      </>
    );
  }

  if (headersShown && !content.current.headers) {
    content.current.headers = (
      <>
        {!isHttp && (
          <NetworkRequestDetailsItem
            label="Headers"
            content={limitChar((item as WebSocketRequest).options?.headers)}
          />
        )}

        {isHttp && (
          <NetworkRequestDetailsItem
            label="Request Headers"
            content={(item as HttpRequest).requestHeadersString}
          />
        )}

        {isHttp && (
          <NetworkRequestDetailsItem
            label="Response Headers"
            content={(item as HttpRequest).responseHeaders}
          />
        )}
      </>
    );
  }

  if (requestShown && !content.current.request) {
    const queryStringParameters: ReactNode[] = [];

    requestUrl.searchParams.forEach((value, name) => {
      queryStringParameters.push(
        <NetworkRequestDetailsItem
          key={keyValueToString(name, value)}
          label="Query String"
          content={keyValueToString(name, value)}
        />,
      );
    });

    content.current.request = (
      <>
        {queryStringParameters}
        <NetworkRequestDetailsItem label="Body" content={limitChar((item as HttpRequest).body)} />
      </>
    );
  }

  if (responseShown && !content.current.response) {
    content.current.response = (
      <NetworkRequestDetailsItem
        label="Response"
        content={limitChar((item as HttpRequest).response)}
      />
    );
  }

  if (messagesShown && !content.current.messages) {
    content.current.messages = (
      <NetworkRequestDetailsItem
        label="Messages"
        content={`\n${(item as WebSocketRequest).messages}`}
      />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {content.current[debuggerState.detailsData!.selectedTab as Exclude<DetailTab, 'logMessage'>]}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray,
  },
  text: {
    fontSize: 14,
    color: colors.black,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
  },
  buttonContent: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
  },
});
