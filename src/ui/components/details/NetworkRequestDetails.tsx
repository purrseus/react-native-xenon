import { useContext, useRef, type JSX } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { MainContext } from '../../../contexts';
import {
  beautify,
  formatRequestDuration,
  formatRequestMethod,
  formatRequestStatusCode,
  getNetworkUtils,
} from '../../../core/utils';
import colors from '../../../theme/colors';
import { type DetailTab, type HttpRequest, type WebSocketRequest } from '../../../types';
import NetworkRequestDetailsItem from '../items/NetworkRequestDetailsItem';

interface NetworkRequestDetailsProps {
  item: HttpRequest | WebSocketRequest;
}

export default function NetworkRequestDetails({ item }: NetworkRequestDetailsProps) {
  const {
    debuggerState: { detailsData },
  } = useContext(MainContext)!;

  const beautified = useRef<boolean | null>(null);
  const shouldBeautifiedRefUpdate = beautified.current !== detailsData?.beautified;

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
          label="Status Code"
          content={formatRequestStatusCode(item.status)}
        />

        <NetworkRequestDetailsItem
          label="Start Time"
          content={new Date(item.startTime ?? 0).toUTCString()}
        />

        <NetworkRequestDetailsItem
          label="End Time"
          content={new Date(item.endTime ?? 0).toUTCString()}
        />

        <NetworkRequestDetailsItem
          label="Duration"
          content={formatRequestDuration(item.startTime, item.endTime)}
        />
      </>
    );
  }

  if (headersShown && !content.current.headers) {
    let headers: [string, string][] = [];
    let requestHeaders: [string, string][] = [];
    let responseHeaders: [string, string][] = [];

    if (!isHttp) {
      headers = Object.entries((item as WebSocketRequest).options?.headers ?? {});
    }

    if (isHttp) {
      for (const [key, value] of ((item as HttpRequest).requestHeaders ?? new Map()).entries()) {
        requestHeaders.push([key, value]);
      }
      for (const [key, value] of ((item as HttpRequest).responseHeaders ?? new Map()).entries()) {
        responseHeaders.push([key, value]);
      }
    }

    content.current.headers = (
      <>
        {!isHttp && !!headers.length && (
          <NetworkRequestDetailsItem label="Headers" content={headers} />
        )}

        {isHttp && !!requestHeaders.length && (
          <NetworkRequestDetailsItem label="Request Headers" content={requestHeaders} />
        )}

        {isHttp && !!responseHeaders.length && (
          <NetworkRequestDetailsItem label="Response Headers" content={responseHeaders} />
        )}
      </>
    );
  }

  if (requestShown && shouldBeautifiedRefUpdate) {
    let queryStringParameters: [string, string][] = [];

    requestUrl.searchParams.forEach((value, name) => {
      queryStringParameters.push([name, value]);
    });

    const body = beautify((item as HttpRequest).body, detailsData?.beautified ?? false);

    content.current.request = (
      <>
        {!!queryStringParameters.length && (
          <NetworkRequestDetailsItem label="Query String" content={queryStringParameters} />
        )}

        {!!body && <NetworkRequestDetailsItem label="Body" content={body} />}
      </>
    );
  }

  if (responseShown && shouldBeautifiedRefUpdate) {
    content.current.response = (
      <NetworkRequestDetailsItem
        label="Response"
        content={beautify((item as HttpRequest).response, detailsData?.beautified ?? false)}
      />
    );
  }

  if (messagesShown && !content.current.messages) {
    content.current.messages = (
      <NetworkRequestDetailsItem label="Messages" content={(item as WebSocketRequest).messages!} />
    );
  }

  if (shouldBeautifiedRefUpdate) {
    beautified.current = detailsData?.beautified ?? false;
  }

  return (
    <ScrollView style={styles.container}>
      {content.current[detailsData!.selectedTab as keyof typeof content.current]}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
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
