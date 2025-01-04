import { enableMapSet } from 'immer';
import { createRef, memo, useImperativeHandle, useRef, type NamedExoticComponent } from 'react';
import { Animated, SafeAreaView, StyleSheet, useWindowDimensions } from 'react-native';
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
}

interface ReactNativeXenon extends XenonComponentMethods {
  Component: NamedExoticComponent<XenonComponentProps>;
}

enableMapSet();

const rootRef = createRef<XenonComponentMethods>();

const XenonComponent = memo<XenonComponentProps>(
  ({ autoInspectNetworkEnabled = true, autoInspectConsoleEnabled = true, bubbleSize = 40 }) => {
    const { width, height } = useWindowDimensions();
    const pan = useRef(new Animated.ValueXY({ x: 0, y: getVerticalSafeMargin(height) }));

    const [debuggerState, setDebuggerState] = useImmer<DebuggerState>({
      visibility: 'hidden',
      position: 'bottom',
      selectedPanel: DebuggerPanel.Network,
    });

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
            <Bubble bubbleSize={bubbleSize} pan={pan} screenWidth={width} screenHeight={height} />
          );
        case 'panel':
          return (
            <SafeAreaView
              style={[
                styles.container,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  [debuggerState.position]: 0,
                  height: Math.min(width, height) * 0.75,
                },
              ]}
            >
              <DebuggerHeader />
              {debuggerState.selectedPanel === DebuggerPanel.Network && <NetworkPanel />}
              {debuggerState.selectedPanel === DebuggerPanel.Console && <ConsolePanel />}
              {!debuggerState.selectedPanel && !!detailsData.value && <DetailsViewer />}
            </SafeAreaView>
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
