import { enableMapSet } from 'immer';
import {
  createRef,
  memo,
  useImperativeHandle,
  useRef,
  useState,
  type NamedExoticComponent,
} from 'react';
import { Animated, SafeAreaView, StyleSheet, useWindowDimensions, View } from 'react-native';
import colors from '../colors';
import MainContext, { type MainContextValue } from '../contexts/MainContext';
import { useConsoleInterceptor, useNetworkInterceptor } from '../hooks';
import { DebuggerPanel, type DebuggerPosition, type DebuggerVisibility } from '../types';
import { Bubble, ConsolePanel, DebuggerHeader, DetailsViewer, NetworkPanel } from './components';

interface XenonComponentMethods {
  isVisible(): boolean;
  show(): void;
  hide(): void;
}

interface XenonComponentProps {
  autoInspectNetworkEnabled?: boolean;
  autoInspectConsoleEnabled?: boolean;
  bubbleSize?: number;
}

interface ReactNativeXenon extends XenonComponentMethods {
  Component: NamedExoticComponent<XenonComponentProps>;
}

enableMapSet();

const rootRef = createRef<XenonComponentMethods>();

const XenonComponent = memo<XenonComponentProps>(
  ({ autoInspectNetworkEnabled = true, autoInspectConsoleEnabled = true, bubbleSize = 40 }) => {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const verticalSafeMargin = screenHeight / 8;

    const pan = useRef(new Animated.ValueXY({ x: 0, y: verticalSafeMargin }));

    const detailsData: MainContextValue['detailsData'] = useRef(null);

    const [debuggerVisibility, setDebuggerVisibility] = useState<DebuggerVisibility>('hidden');

    const [debuggerPosition, setDebuggerPosition] = useState<DebuggerPosition>('bottom');

    const [panelSelected, setPanelSelected] = useState<DebuggerPanel | null>(DebuggerPanel.Network);

    const networkInterceptor = useNetworkInterceptor({
      autoEnabled: autoInspectNetworkEnabled,
    });

    const logInterceptor = useConsoleInterceptor({
      autoEnabled: autoInspectConsoleEnabled,
    });

    useImperativeHandle(
      rootRef,
      () => ({
        isVisible() {
          return debuggerVisibility !== 'hidden';
        },
        show() {
          setDebuggerVisibility('bubble');
        },
        hide() {
          setDebuggerVisibility('hidden');
        },
      }),
      [debuggerVisibility],
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
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    top: undefined,
    bottom: undefined,
    zIndex: 9999,
    backgroundColor: colors.lightGray,
  },
  bubbleBackdrop: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'box-none',
  },
});

XenonComponent.displayName = 'Xenon';

const Xenon: ReactNativeXenon = {
  isVisible() {
    return rootRef.current?.isVisible() ?? false;
  },
  show() {
    rootRef.current?.show();
  },
  hide() {
    rootRef.current?.hide();
  },
  Component: XenonComponent,
};

export default Xenon;
