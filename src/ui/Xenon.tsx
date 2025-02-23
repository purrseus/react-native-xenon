import { enableMapSet } from 'immer';
import { createRef, memo, useImperativeHandle, useMemo, useRef } from 'react';
import { Animated, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useImmer } from 'use-immer';
import MainContext from '../contexts/MainContext';
import { getVerticalSafeMargin } from '../core/utils';
import { useConsoleInterceptor, useNetworkInterceptor } from '../hooks';
import colors from '../theme/colors';
import { DebuggerPanel, type DebuggerState } from '../types';
import { Bubble, ConsolePanel, DebuggerHeader, DetailsViewer, NetworkPanel } from './components';
import { FullWindowOverlay } from 'react-native-screens';

namespace Xenon {
  interface Methods {
    isVisible(): boolean;
    show(): void;
    hide(): void;
  }

  interface Props {
    autoInspectNetworkEnabled?: boolean;
    autoInspectConsoleEnabled?: boolean;
    bubbleSize?: number;
    idleBubbleOpacity?: number;
  }

  enableMapSet();
  const ref = createRef<Methods>();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      ...StyleSheet.absoluteFillObject,
      top: undefined,
      bottom: undefined,
      zIndex: 9999,
      backgroundColor: colors.lightGray,
      borderBottomColor: colors.gray,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    safeArea: {
      flex: 1,
    },
  });

  export const isVisible = () => ref.current?.isVisible() ?? false;
  export const show = (): void => ref.current?.show();
  export const hide = (): void => ref.current?.hide();

  const Debugger = memo(
    ({
      autoInspectNetworkEnabled = true,
      autoInspectConsoleEnabled = true,
      bubbleSize = 40,
      idleBubbleOpacity = 0.5,
    }: Props) => {
      const { width, height } = useWindowDimensions();
      const pan = useRef(new Animated.ValueXY({ x: 0, y: getVerticalSafeMargin(height) }));

      const [debuggerState, setDebuggerState] = useImmer<DebuggerState>({
        visibility: 'hidden',
        position: 'bottom',
        selectedPanel: DebuggerPanel.Network,
        detailsData: null,
      });

      const detailsShown = useMemo(
        () => !debuggerState.selectedPanel && !!debuggerState.detailsData,
        [debuggerState.detailsData, debuggerState.selectedPanel],
      );

      const containerStyle = useMemo(
        () => [
          styles.container,
          { [debuggerState.position]: 0, height: Math.min(width, height) * 0.75 },
        ],
        [debuggerState.position, height, width],
      );

      const networkInterceptor = useNetworkInterceptor({
        autoEnabled: autoInspectNetworkEnabled,
      });

      const consoleInterceptor = useConsoleInterceptor({
        autoEnabled: autoInspectConsoleEnabled,
      });

      useImperativeHandle(ref, () => {
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

      return (
        <MainContext.Provider
          value={{ debuggerState, setDebuggerState, networkInterceptor, consoleInterceptor }}
        >
          {debuggerState.visibility === 'bubble' && (
            <Bubble
              bubbleSize={bubbleSize}
              idleBubbleOpacity={idleBubbleOpacity}
              pan={pan}
              screenWidth={width}
              screenHeight={height}
            />
          )}

          {debuggerState.visibility === 'panel' && (
            <SafeAreaProvider style={containerStyle}>
              <SafeAreaView style={styles.safeArea}>
                <DebuggerHeader />
                {debuggerState.selectedPanel === DebuggerPanel.Network && <NetworkPanel />}
                {debuggerState.selectedPanel === DebuggerPanel.Console && <ConsolePanel />}
                {detailsShown && <DetailsViewer />}
              </SafeAreaView>
            </SafeAreaProvider>
          )}
        </MainContext.Provider>
      );
    },
  );

  export function Component(props: Props) {
    if (Platform.OS === 'ios') {
      return (
        <FullWindowOverlay>
          <Debugger {...props} />
        </FullWindowOverlay>
      );
    }

    return <Debugger {...props} />;
  }

  Component.displayName = 'Xenon';
}

export default Xenon;
