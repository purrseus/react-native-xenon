import { createRef, useImperativeHandle, useRef, useState } from 'react';
import { Animated, SafeAreaView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useLogInterceptor, useNetworkInterceptor } from '../hooks';
import type {
  DebuggerPanel,
  DebuggerPosition,
  DebuggerVisibility,
  HttpRecord,
  LogRecord,
  WebSocketRecord,
} from '../types';
import { Bubble, ConsolePanel, DebuggerHeader, DetailsViewer, NetworkPanel } from './components';
import Context from './Context';

interface XenonComponentMethods {
  show: () => void;
  hide: () => void;
}

interface XenonComponentProps {
  autoRecordNetwork?: boolean;
  autoRecordLogs?: boolean;
  bubbleSize?: number;
}

const rootRef = createRef<XenonComponentMethods>();

function XenonComponent({
  autoRecordNetwork = true,
  autoRecordLogs = true,
  bubbleSize = 40,
}: XenonComponentProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const verticalSafeValue = screenHeight / 8;

  const pan = useRef(new Animated.ValueXY({ x: 0, y: verticalSafeValue }));

  const detailsData = useRef<Partial<
    Record<DebuggerPanel, LogRecord | HttpRecord | WebSocketRecord>
  > | null>(null);

  const [debuggerVisibility, setDebuggerVisibility] = useState<DebuggerVisibility>('hidden');

  const [debuggerPosition, setDebuggerPosition] = useState<DebuggerPosition>('bottom');

  const [panelSelected, setPanelSelected] = useState<DebuggerPanel | null>('network');

  const networkInterceptor = useNetworkInterceptor({
    autoEnabled: autoRecordNetwork,
  });

  const logInterceptor = useLogInterceptor({
    autoEnabled: autoRecordLogs,
  });

  useImperativeHandle(
    rootRef,
    () => ({
      show: () => {
        setDebuggerVisibility('bubble');
      },
      hide: () => {
        setDebuggerVisibility('hidden');
      },
    }),
    [],
  );

  let content;

  switch (debuggerVisibility) {
    case 'bubble':
      content = (
        <View style={styles.bubbleBackdrop}>
          <Bubble bubbleSize={bubbleSize} pan={pan} />
        </View>
      );
      break;
    case 'panel':
      content = (
        <SafeAreaView
          style={[
            styles.container,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              [debuggerPosition]: 0,
              height: Math.min(screenWidth, screenHeight) * 0.75,
            },
          ]}
        >
          <DebuggerHeader />

          {panelSelected === 'network' && <NetworkPanel />}
          {panelSelected === 'log' && <ConsolePanel />}

          {!panelSelected && !!detailsData.current && <DetailsViewer />}
        </SafeAreaView>
      );
      break;
    default:
      content = null;
  }

  return (
    <Context.Provider
      value={{
        debuggerVisibility,
        setDebuggerVisibility,
        debuggerPosition,
        setDebuggerPosition,
        panelSelected,
        setPanelSelected,
        networkInterceptor,
        logInterceptor,
        detailsData,
        screenWidth,
        screenHeight,
        verticalSafeValue,
      }}
    >
      {content}
    </Context.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    top: undefined,
    bottom: undefined,
    zIndex: 9999,
    backgroundColor: '#AAAAAA',
  },
  bubbleBackdrop: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'box-none',
  },
});

XenonComponent.displayName = 'Xenon';

const Xenon = {
  show() {
    rootRef.current?.show();
  },
  hide() {
    rootRef.current?.hide();
  },
  Component: XenonComponent,
};

export default Xenon;
