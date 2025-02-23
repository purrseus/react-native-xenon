import { useCallback, useContext, useMemo, useRef } from 'react';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import { MainContext } from '../../../contexts';
import { convertToCurl, getNetworkUtils } from '../../../core/utils';
import colors from '../../../theme/colors';
import icons from '../../../theme/icons';
import { DebuggerPanel, NetworkType, type DetailTab } from '../../../types';
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

  const networkHeader = useMemo(() => {
    if (detailsData?.type !== DebuggerPanel.Network) return null;

    const { isHttp, overviewShown, headersShown, requestShown, responseShown, messagesShown } =
      getNetworkUtils(detailsData.data);

    return (
      <>
        {backButton}

        {isHttp && (
          <>
            <DebuggerHeaderItem
              content={icons.share}
              onPress={async () => {
                if (isSharing || detailsData.data.type === NetworkType.WS) return;

                try {
                  isSharing = true;
                  setDebuggerState(draft => {
                    draft.visibility = 'bubble';
                  });

                  await Share.share({
                    message: convertToCurl(
                      detailsData.data.method,
                      detailsData.data.url,
                      detailsData.data.requestHeaders,
                      detailsData.data.body,
                    ),
                  });
                } catch (error) {
                  // Handle error
                } finally {
                  isSharing = false;
                }
              }}
            />

            <DebuggerHeaderItem
              content={icons.beautify}
              isActive={detailsData.beautified}
              activeColor={colors.green}
              onPress={() => {
                setDebuggerState(draft => {
                  draft.detailsData!.beautified = !draft.detailsData?.beautified;
                });
              }}
            />
          </>
        )}

        <View style={styles.divider} />

        {overviewShown && renderTabItem('overview', 'Overview')}
        {headersShown && renderTabItem('headers', 'Headers')}
        {requestShown && renderTabItem('request', 'Request')}
        {responseShown && renderTabItem('response', 'Response')}
        {messagesShown && renderTabItem('messages', 'Messages')}
      </>
    );
  }, [
    detailsData?.type,
    detailsData?.data,
    detailsData?.beautified,
    backButton,
    renderTabItem,
    setDebuggerState,
  ]);

  const consoleHeader = useMemo(() => {
    if (detailsData?.type !== DebuggerPanel.Console) return null;

    return (
      <>
        {backButton}

        <View style={styles.divider} />

        {renderTabItem('logMessage', 'Log Message')}
      </>
    );
  }, [detailsData?.type, backButton, renderTabItem]);

  const mainHeader = useMemo(() => {
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
        <DebuggerHeaderItem onPress={onHide} content={icons.hide} />

        <DebuggerHeaderItem onPress={onMove} content={icons.move} />

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
  }, [selectedPanel, consoleInterceptor, networkInterceptor, setDebuggerState]);

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
