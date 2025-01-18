import { useContext, useMemo, useRef } from 'react';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import { MainContext } from '../../../contexts';
import { convertToCurl, getNetworkUtils } from '../../../core/utils';
import colors from '../../../theme/colors';
import icons from '../../../theme/icons';
import { DebuggerPanel, NetworkType } from '../../../types';
import DebuggerHeaderItem from '../items/DebuggerHeaderItem';

export default function DebuggerHeader() {
  const { debuggerState, setDebuggerState, networkInterceptor, consoleInterceptor } =
    useContext(MainContext)!;

  const lastSelectedPanel = useRef<DebuggerPanel>(
    debuggerState.selectedPanel ?? DebuggerPanel.Network,
  );

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

  const networkHeader = useMemo(() => {
    if (debuggerState.detailsData?.type !== DebuggerPanel.Network) return null;

    const { data, selectedTab } = debuggerState.detailsData;
    const { isHttp, overviewShown, headersShown, requestShown, responseShown, messagesShown } =
      getNetworkUtils(data);

    const renderTabItem = (tab: typeof selectedTab, label: string) => (
      <DebuggerHeaderItem
        isLabel
        isActive={selectedTab === tab}
        content={label}
        onPress={() => {
          setDebuggerState(draft => {
            draft.detailsData!.selectedTab = tab;
          });
        }}
      />
    );

    return (
      <>
        {backButton}

        {isHttp && (
          <DebuggerHeaderItem
            content={icons.share}
            onPress={() => {
              if (data.type === NetworkType.WS) return;
              Share.share({
                message: convertToCurl(data.method, data.url, data.requestHeaders, data.body),
              });
            }}
          />
        )}

        <View style={styles.divider} />

        {overviewShown && renderTabItem('overview', 'Overview')}
        {headersShown && renderTabItem('headers', 'Headers')}
        {requestShown && renderTabItem('request', 'Request')}
        {responseShown && renderTabItem('response', 'Response')}
        {messagesShown && renderTabItem('messages', 'Messages')}
      </>
    );
  }, [debuggerState.detailsData, backButton, setDebuggerState]);

  const consoleHeader = useMemo(() => {
    if (debuggerState.detailsData?.type !== DebuggerPanel.Console) return null;

    const { selectedTab } = debuggerState.detailsData;

    return (
      <>
        {backButton}

        <View style={styles.divider} />

        <DebuggerHeaderItem
          isLabel
          isActive={selectedTab === 'logMessage'}
          content="Log Message"
          onPress={() => {
            setDebuggerState(draft => {
              draft.detailsData!.selectedTab = 'logMessage';
            });
          }}
        />
      </>
    );
  }, [backButton, debuggerState.detailsData, setDebuggerState]);

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
          isActive={debuggerState.selectedPanel === DebuggerPanel.Network}
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
          isActive={debuggerState.selectedPanel === DebuggerPanel.Console}
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
  }, [debuggerState.selectedPanel, consoleInterceptor, networkInterceptor, setDebuggerState]);

  return (
    <ScrollView
      horizontal
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsHorizontalScrollIndicator={false}
    >
      {(() => {
        switch (debuggerState.detailsData?.type) {
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
  },
  contentContainer: {
    padding: 8,
    columnGap: 8,
  },
  divider: {
    width: 1,
    backgroundColor: colors.gray,
  },
});
