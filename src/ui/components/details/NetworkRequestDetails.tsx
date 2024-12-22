import { useRef, useState, type JSX, type ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { URL } from 'react-native-url-polyfill';
import {
  NetworkType,
  type HttpRequest,
  type NetworkTab,
  type WebSocketRequest,
} from '../../../types';
import {
  convertToCurl,
  formatRequestDuration,
  formatRequestMethod,
  formatRequestStatusCode,
  limitChar,
} from '../../../utils';
import NetworkDetailsHeader from '../headers/NetworkRequestDetailsHeader';
import NetworkRequestDetailsItem from '../items/NetworkRequestDetailsItem';
import colors from '../../../colors';

interface NetworkRequestDetailsProps {
  item: HttpRequest | WebSocketRequest;
}

export default function NetworkRequestDetails({ item }: NetworkRequestDetailsProps) {
  const [selectedTab, setSelectedTab] = useState<NetworkTab>('headers');

  const isWebSocket = item.type === NetworkType.WS;

  const requestUrl = new URL(item.url);

  const headerShown = !!item.url;
  const queryStringParametersShown = !!requestUrl.search;
  const bodyShown = !isWebSocket && !!item.body;
  const responseShown = !isWebSocket && !!item.response;
  const messagesShown = isWebSocket && !!item.messages;

  const content = useRef<Record<NetworkTab, JSX.Element | null>>({
    headers: null,
    queryStringParameters: null,
    body: null,
    response: null,
    messages: null,
  });

  if (headerShown && !content.current.headers) {
    content.current.headers = (
      <>
        <NetworkRequestDetailsItem label="Request Type" content={item.type} />

        <NetworkRequestDetailsItem label="Request URL" content={item.url} />

        <NetworkRequestDetailsItem
          label="Request Method"
          content={formatRequestMethod(isWebSocket ? undefined : item.method)}
        />

        <NetworkRequestDetailsItem
          label="Duration"
          content={formatRequestDuration(item.duration)}
        />

        <NetworkRequestDetailsItem
          label="Status Code"
          content={formatRequestStatusCode(item.status)}
        />

        {isWebSocket && (
          <NetworkRequestDetailsItem label="Headers" content={limitChar(item.options?.headers)} />
        )}

        {!isWebSocket && (
          <NetworkRequestDetailsItem label="Response Headers" content={item.responseHeaders} />
        )}

        {!isWebSocket && (
          <NetworkRequestDetailsItem label="Request Headers" content={item.requestHeadersString} />
        )}

        {!isWebSocket && (
          <NetworkRequestDetailsItem
            content={convertToCurl(item.method, item.url, item.requestHeaders, item.body)}
            selectable
          />
        )}
      </>
    );
  }

  if (queryStringParametersShown && !content.current.queryStringParameters) {
    const queryStringParameters: ReactNode[] = [];

    requestUrl.searchParams.forEach((value, name) => {
      queryStringParameters.push(
        <NetworkRequestDetailsItem key={name} label={name} content={value} />,
      );
    });

    content.current.queryStringParameters = <>{queryStringParameters}</>;
  }

  if (bodyShown && !content.current.body) {
    content.current.body = <NetworkRequestDetailsItem content={limitChar(item.body)} />;
  }

  if (responseShown && !content.current.response) {
    content.current.response = <NetworkRequestDetailsItem content={limitChar(item.response)} />;
  }

  if (messagesShown && !content.current.messages) {
    content.current.messages = <NetworkRequestDetailsItem content={item.messages} />;
  }

  return (
    <>
      <NetworkDetailsHeader
        selectedTab={selectedTab}
        onChangeTab={setSelectedTab}
        headersShown={headerShown}
        queryStringParametersShown={queryStringParametersShown}
        bodyShown={bodyShown}
        responseShown={responseShown}
        messagesShown={messagesShown}
      />
      <ScrollView style={styles.container}>{content.current[selectedTab]}</ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
