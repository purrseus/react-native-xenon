import { useCallback, useContext, useMemo, useRef } from 'react';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import { MainContext } from '../../../contexts';
import { convertToCurl, getNetworkUtils } from '../../../core/utils';
import colors from '../../../theme/colors';
import icons from '../../../theme/icons';
import {
  DebuggerPanel,
  NetworkType,
  type DetailTab,
  type HttpRequest,
  type WebSocketRequest,
} from '../../../types';
import DebuggerHeaderItem from '../items/DebuggerHeaderItem';

let isSharing = false;

export default function DebuggerHeader() {
  const {
    debuggerState: { detailsData, selectedPanel },
    setDebuggerState,
    networkInterceptor,
    consoleInterceptor,
  } = useContext(MainContext)!;

  const lastSelectedPanel = useRef<DebuggerPanel>(selectedPanel ?? DebuggerPanel.Network);

  const backButton = useMemo(
    () => (
      <DebuggerHeaderItem
        content={icons.arrowLeft}
        onPress={() => {
          setDebuggerState(draft => {
            draft.selectedPanel = lastSelectedPanel.current;
            draft.detailsData = null;
          });
        }}
      />
    ),
    [setDebuggerState],
  );

  const renderTabItem = useCallback(
    (tab: DetailTab, label: string) => (
      <DebuggerHeaderItem
        isLabel
        isActive={detailsData?.selectedTab === tab}
        content={label}
        onPress={() => {
          setDebuggerState(draft => {
            draft.detailsData!.selectedTab = tab;
          });
        }}
      />
    ),
    [detailsData?.selectedTab, setDebuggerState],
  );

  const mainButtons = useMemo(() => {
    const onHide = () => {
      setDebuggerState(draft => {
        draft.visibility = 'bubble';
      });
    };

    const onMove = () => {
      setDebuggerState(draft => {
        draft.position = draft.position === 'bottom' ? 'top' : 'bottom';
      });
    };

    return (
      <>
        <DebuggerHeaderItem onPress={onHide} content={icons.hide} />

        <DebuggerHeaderItem onPress={onMove} content={icons.move} />
      </>
    );
  }, [setDebuggerState]);

  const mainHeader = useMemo(() => {
    const switchTo = (debuggerPanel: DebuggerPanel) => {
      setDebuggerState(draft => {
        draft.selectedPanel = debuggerPanel;
        draft.detailsData = null;
        lastSelectedPanel.current = debuggerPanel;
      });
    };

    const toggleNetworkInterception = () => {
      networkInterceptor.isInterceptorEnabled
        ? networkInterceptor.disableInterception()
        : networkInterceptor.enableInterception();
    };

    const toggleConsoleInterception = () => {
      consoleInterceptor.isInterceptorEnabled
        ? consoleInterceptor.disableInterception()
        : consoleInterceptor.enableInterception();
    };

    return (
      <>
        {mainButtons}

        <View style={styles.divider} />

        <DebuggerHeaderItem
          isLabel
          isActive={selectedPanel === DebuggerPanel.Network}
          content="Network Panel"
          onPress={() => switchTo(DebuggerPanel.Network)}
        />

        <DebuggerHeaderItem
          onPress={toggleNetworkInterception}
          isActive={networkInterceptor.isInterceptorEnabled}
          content={icons.record}
        />

        <DebuggerHeaderItem
          onPress={networkInterceptor.clearAllNetworkRequests}
          content={icons.delete}
        />

        <View style={styles.divider} />

        <DebuggerHeaderItem
          isLabel
          isActive={selectedPanel === DebuggerPanel.Console}
          content="Console Panel"
          onPress={() => switchTo(DebuggerPanel.Console)}
        />

        <DebuggerHeaderItem
          onPress={toggleConsoleInterception}
          isActive={consoleInterceptor.isInterceptorEnabled}
          content={icons.record}
        />

        <DebuggerHeaderItem
          onPress={consoleInterceptor.clearAllLogMessages}
          content={icons.delete}
        />
      </>
    );
  }, [mainButtons, selectedPanel, networkInterceptor, consoleInterceptor, setDebuggerState]);

  const networkHeader = useMemo(() => {
    const data = detailsData?.data as HttpRequest | WebSocketRequest | undefined;
    if (!data?.url) return null;

    const { isHttp, overviewShown, headersShown, requestShown, responseShown, messagesShown } =
      getNetworkUtils(data);

    return (
      <>
        {backButton}
        {mainButtons}

        <View style={styles.divider} />

        {overviewShown && renderTabItem('overview', 'Overview')}
        {headersShown && renderTabItem('headers', 'Headers')}
        {requestShown && renderTabItem('request', 'Request')}
        {responseShown && renderTabItem('response', 'Response')}
        {messagesShown && renderTabItem('messages', 'Messages')}

        {isHttp && (
          <>
            <View style={styles.divider} />

            <DebuggerHeaderItem
              content={icons.beautify}
              isActive={detailsData?.beautified}
              activeColor={colors.green}
              onPress={() => {
                setDebuggerState(draft => {
                  draft.detailsData!.beautified = !draft.detailsData?.beautified;
                });
              }}
            />
            <DebuggerHeaderItem
              content={icons.share}
              onPress={async () => {
                if (isSharing || data.type === NetworkType.WS) return;

                try {
                  isSharing = true;
                  setDebuggerState(draft => {
                    draft.visibility = 'bubble';
                  });

                  await Share.share({
                    message: convertToCurl(data.method, data.url, data.requestHeaders, data.body),
                  });
                } catch (error) {
                  // Handle error
                } finally {
                  isSharing = false;
                }
              }}
            />
          </>
        )}
      </>
    );
  }, [
    detailsData?.data,
    detailsData?.beautified,
    backButton,
    mainButtons,
    renderTabItem,
    setDebuggerState,
  ]);

  const consoleHeader = useMemo(() => {
    return (
      <>
        {backButton}
        {mainButtons}

        <View style={styles.divider} />

        {renderTabItem('logMessage', 'Log Message')}
      </>
    );
  }, [backButton, mainButtons, renderTabItem]);

  return (
    <ScrollView
      horizontal
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsHorizontalScrollIndicator={false}
    >
      {(() => {
        switch (detailsData?.type) {
          case DebuggerPanel.Network:
            return networkHeader;
          case DebuggerPanel.Console:
            return consoleHeader;
          default:
            return mainHeader;
        }
      })()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    borderTopColor: colors.gray,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  contentContainer: {
    padding: 8,
    columnGap: 8,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.gray,
  },
});
