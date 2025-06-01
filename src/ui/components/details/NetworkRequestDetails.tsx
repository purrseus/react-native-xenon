import { forwardRef, useContext, useRef, type JSX, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
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

const TabScrollView = ({ id, children }: { id: string; children: ReactNode }) => (
  <ScrollView key={id} contentContainerStyle={styles.contentContainer}>
    {children}
  </ScrollView>
);

const NetworkRequestDetails = forwardRef<View, { style?: StyleProp<ViewStyle> }>(
  ({ style }, ref) => {
    const {
      debuggerState: { detailsData },
    } = useContext(MainContext)!;

    const item = detailsData?.data as HttpRequest | WebSocketRequest | undefined;

    const beautified = useRef<boolean | null>(null);
    const shouldBeautifiedRefUpdate =
      beautified.current !== detailsData?.beautified &&
      typeof detailsData?.beautified === 'boolean';

    const {
      isWS,
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

    if (!item) {
      content.current.overview = null;
      content.current.headers = null;
      content.current.request = null;
      content.current.response = null;
      content.current.messages = null;
      beautified.current = null;
    }

    if (overviewShown && !content.current.overview && item) {
      content.current.overview = (
        <TabScrollView id="overview">
          <NetworkRequestDetailsItem label="Request Type" content={item.type} />

          <NetworkRequestDetailsItem label="Request URL" content={item.url} />

          <NetworkRequestDetailsItem
            label="Request Method"
            content={formatRequestMethod(isWS ? undefined : (item as HttpRequest).method)}
          />

          <NetworkRequestDetailsItem
            label="Status Code"
            content={formatRequestStatusCode(item.status)}
          />

          <NetworkRequestDetailsItem
            label="Start Time"
            content={new Date(item.startTime ?? 0).toISOString()}
          />

          <NetworkRequestDetailsItem
            label="End Time"
            content={new Date(item.endTime ?? 0).toISOString()}
          />

          <NetworkRequestDetailsItem
            label="Duration"
            content={formatRequestDuration(item.startTime, item.endTime)}
          />
        </TabScrollView>
      );
    }

    if (headersShown && !content.current.headers && item) {
      let headers: [string, string][] = [];
      const requestHeaders: [string, string][] = [];
      const responseHeaders: [string, string][] = [];

      if (isWS) {
        headers = Object.entries((item as WebSocketRequest).options?.headers ?? {});
      } else {
        for (const [key, value] of ((item as HttpRequest).requestHeaders ?? new Map()).entries()) {
          requestHeaders.push([key, value]);
        }
        for (const [key, value] of ((item as HttpRequest).responseHeaders ?? new Map()).entries()) {
          responseHeaders.push([key, value]);
        }
      }

      content.current.headers = (
        <TabScrollView id="headers">
          {isWS && !!headers.length && (
            <NetworkRequestDetailsItem label="Headers" content={headers} />
          )}

          {!isWS && !!requestHeaders.length && (
            <NetworkRequestDetailsItem label="Request Headers" content={requestHeaders} />
          )}

          {!isWS && !!responseHeaders.length && (
            <NetworkRequestDetailsItem label="Response Headers" content={responseHeaders} />
          )}
        </TabScrollView>
      );
    }

    if (requestShown && shouldBeautifiedRefUpdate && item) {
      const queryStringParameters: [string, string][] = [];

      requestUrl.searchParams.forEach((value, name) => {
        queryStringParameters.push([name, value]);
      });

      const body = beautify((item as HttpRequest).body, detailsData?.beautified ?? false);

      content.current.request = (
        <TabScrollView id="request">
          {!!queryStringParameters.length && (
            <NetworkRequestDetailsItem label="Query String" content={queryStringParameters} />
          )}

          {!!body && <NetworkRequestDetailsItem label="Body" content={body} />}
        </TabScrollView>
      );
    }

    if (responseShown && shouldBeautifiedRefUpdate && item) {
      const response = beautify((item as HttpRequest).response, detailsData?.beautified ?? false);
      content.current.response = (
        <TabScrollView id="response">
          <NetworkRequestDetailsItem label="Response" content={response} />
        </TabScrollView>
      );
    }

    if (messagesShown && !content.current.messages && item) {
      content.current.messages = (
        <TabScrollView id="messages">
          <NetworkRequestDetailsItem
            label="Messages"
            content={(item as WebSocketRequest).messages!}
          />
        </TabScrollView>
      );
    }

    if (shouldBeautifiedRefUpdate) {
      beautified.current = detailsData?.beautified ?? false;
    }

    return (
      <View ref={ref} style={[styles.container, style]}>
        {content.current[detailsData?.selectedTab as keyof typeof content.current]}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 8,
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

export default NetworkRequestDetails;
