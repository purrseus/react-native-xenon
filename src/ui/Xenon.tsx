import { enableMapSet } from 'immer';
import {
  createRef,
  memo,
  useImperativeHandle,
  useMemo,
  useRef,
  type NamedExoticComponent,
} from 'react';
import { Animated, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useImmer } from 'use-immer';
import MainContext from '../contexts/MainContext';
import { detailsData } from '../core/data';
import { getVerticalSafeMargin } from '../core/utils';
import { useConsoleInterceptor, useNetworkInterceptor } from '../hooks';
import colors from '../theme/colors';
import { DebuggerPanel, type DebuggerState } from '../types';
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
  idleBubbleOpacity?: number;
}

interface ReactNativeXenon extends XenonComponentMethods {
  Component: NamedExoticComponent<XenonComponentProps>;
}

enableMapSet();

const rootRef = createRef<XenonComponentMethods>();

const XenonComponent = memo<XenonComponentProps>(
  ({
    autoInspectNetworkEnabled = true,
    autoInspectConsoleEnabled = true,
    bubbleSize = 40,
    idleBubbleOpacity = 0.5,
  }) => {
    const { width, height } = useWindowDimensions();
    const pan = useRef(new Animated.ValueXY({ x: 0, y: getVerticalSafeMargin(height) }));

    const [debuggerState, setDebuggerState] = useImmer<DebuggerState>({
      visibility: 'hidden',
      position: 'bottom',
      selectedPanel: DebuggerPanel.Network,
    });

    const detailsShown = useMemo(
      () => !debuggerState.selectedPanel && !!detailsData.value,
      [debuggerState.selectedPanel],
    );

    const networkInterceptor = useNetworkInterceptor({
      autoEnabled: autoInspectNetworkEnabled,
    });

    const logInterceptor = useConsoleInterceptor({
      autoEnabled: autoInspectConsoleEnabled,
    });

    useImperativeHandle(rootRef, () => {
      const changeVisibility = (condition: boolean, value: DebuggerState['visibility']) => {
        if (!condition) return;

        setDebuggerState(draft => {
          draft.visibility = value;
        });
      };

      return {
        isVisible() {
          return debuggerState.visibility !== 'hidden';
        },
        show() {
          changeVisibility(!this.isVisible(), 'bubble');
        },
        hide() {
          changeVisibility(this.isVisible(), 'hidden');
        },
      };
    }, [debuggerState.visibility, setDebuggerState]);

    const renderContent = () => {
      switch (debuggerState.visibility) {
        case 'bubble':
          return (
            <Bubble
              bubbleSize={bubbleSize}
              idleBubbleOpacity={idleBubbleOpacity}
              pan={pan}
              screenWidth={width}
              screenHeight={height}
            />
          );
        case 'panel':
          return (
            <SafeAreaProvider
              style={[
                styles.container,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  [debuggerState.position]: 0,
                  height: Math.min(width, height) * 0.75,
                },
              ]}
            >
              <SafeAreaView style={styles.safeArea}>
                <DebuggerHeader detailsShown={detailsShown} />
                {debuggerState.selectedPanel === DebuggerPanel.Network && <NetworkPanel />}
                {debuggerState.selectedPanel === DebuggerPanel.Console && <ConsolePanel />}
                {detailsShown && <DetailsViewer />}
              </SafeAreaView>
            </SafeAreaProvider>
          );
        default:
          return null;
      }
    };

    return (
      <MainContext.Provider
        value={{ debuggerState, setDebuggerState, networkInterceptor, logInterceptor }}
      >
        {renderContent()}
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
  safeArea: {
    flex: 1,
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
