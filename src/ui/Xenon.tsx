import { createRef, useImperativeHandle, useRef, useState, type JSX } from 'react';
import { Animated, SafeAreaView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useConsoleInterceptor, useNetworkInterceptor } from '../hooks';
import { DebuggerPanel, type DebuggerPosition, type DebuggerVisibility } from '../types';
import { Bubble, ConsolePanel, DebuggerHeader, DetailsViewer, NetworkPanel } from './components';
import MainContext, { type MainContextValue } from '../contexts/MainContext';

interface XenonComponentMethods {
  show: () => void;
  hide: () => void;
}

interface XenonComponentProps {
  autoRecordNetwork?: boolean;
  autoRecordLogs?: boolean;
  bubbleSize?: number;
}

interface ReactNativeXenon extends XenonComponentMethods {
  Component(props: XenonComponentProps): JSX.Element;
}

const rootRef = createRef<XenonComponentMethods>();

function XenonComponent({
  autoRecordNetwork = true,
  autoRecordLogs = true,
  bubbleSize = 40,
}: XenonComponentProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const verticalSafeMargin = screenHeight / 8;

  const pan = useRef(new Animated.ValueXY({ x: 0, y: verticalSafeMargin }));

  const detailsData: MainContextValue['detailsData'] = useRef(null);

  const [debuggerVisibility, setDebuggerVisibility] = useState<DebuggerVisibility>('hidden');

  const [debuggerPosition, setDebuggerPosition] = useState<DebuggerPosition>('bottom');

  const [panelSelected, setPanelSelected] = useState<DebuggerPanel | null>(DebuggerPanel.Network);

  const networkInterceptor = useNetworkInterceptor({
    autoEnabled: autoRecordNetwork,
  });

  const logInterceptor = useConsoleInterceptor({
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

          {panelSelected === DebuggerPanel.Network && <NetworkPanel />}
          {panelSelected === DebuggerPanel.Console && <ConsolePanel />}

          {!panelSelected && !!detailsData.current && <DetailsViewer />}
        </SafeAreaView>
      );
      break;
    default:
      content = null;
  }

  return (
    <MainContext.Provider
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
        verticalSafeMargin,
      }}
    >
      {content}
    </MainContext.Provider>
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

const Xenon: ReactNativeXenon = {
  show() {
    rootRef.current?.show();
  },
  hide() {
    rootRef.current?.hide();
  },
  Component: XenonComponent,
};

export default Xenon;
