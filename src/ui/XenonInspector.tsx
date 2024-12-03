import { createRef, useImperativeHandle, useRef, useState } from 'react';
import { Animated, SafeAreaView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useLogInterceptor, useNetworkInterceptor } from '../hooks';
import type {
  HttpRecord,
  InspectorPanel,
  InspectorPosition,
  InspectorVisibility,
  LogRecord,
  WebSocketRecord,
} from '../types';
import {
  InspectorBubble,
  InspectorDetails,
  InspectorHeader,
  LogInspectorList,
  NetworkInspectorList,
} from './components';
import InspectorContext from './contexts/InspectorContext';

interface XenonInspectorMethods {
  show: () => void;
  hide: () => void;
}

interface XenonInspectorProps {
  networkInspectorAutoEnabled?: boolean;
  logInspectorAutoEnabled?: boolean;
  bubbleSize?: number;
}

const rootRef = createRef<XenonInspectorMethods>();

function XenonInspectorComponent({
  networkInspectorAutoEnabled = false,
  logInspectorAutoEnabled = false,
  bubbleSize = 40,
}: XenonInspectorProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const verticalSafeValue = screenHeight / 8;

  const pan = useRef(new Animated.ValueXY({ x: 0, y: verticalSafeValue }));

  const detailsData = useRef<Partial<
    Record<InspectorPanel, LogRecord | HttpRecord | WebSocketRecord>
  > | null>(null);

  const [inspectorVisibility, setInspectorVisibility] = useState<InspectorVisibility>('hidden');

  const [inspectorPosition, setInspectorPosition] = useState<InspectorPosition>('bottom');

  const [panelSelected, setPanelSelected] = useState<InspectorPanel | null>('network');

  const networkInterceptor = useNetworkInterceptor({
    autoEnabled: networkInspectorAutoEnabled,
  });

  const logInterceptor = useLogInterceptor({
    autoEnabled: logInspectorAutoEnabled,
  });

  useImperativeHandle(
    rootRef,
    () => ({
      show: () => {
        setInspectorVisibility('bubble');
      },
      hide: () => {
        setInspectorVisibility('hidden');
      },
    }),
    [],
  );

  let content;

  switch (inspectorVisibility) {
    case 'bubble':
      content = (
        <View style={styles.bubbleBackdrop}>
          <InspectorBubble bubbleSize={bubbleSize} pan={pan} />
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
              [inspectorPosition]: 0,
              height: Math.min(screenWidth, screenHeight) * 0.75,
            },
          ]}
        >
          <InspectorHeader />

          {panelSelected === 'network' && <NetworkInspectorList />}
          {panelSelected === 'log' && <LogInspectorList />}

          {!panelSelected && !!detailsData.current && <InspectorDetails />}
        </SafeAreaView>
      );
      break;
    default:
      content = null;
  }

  return (
    <InspectorContext.Provider
      value={{
        inspectorVisibility,
        setInspectorVisibility,
        inspectorPosition,
        setInspectorPosition,
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
    </InspectorContext.Provider>
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

XenonInspectorComponent.displayName = 'XenonInspector';

const XenonInspector = {
  show() {
    rootRef.current?.show();
  },
  hide() {
    rootRef.current?.hide();
  },
  Component: XenonInspectorComponent,
};

export default XenonInspector;
