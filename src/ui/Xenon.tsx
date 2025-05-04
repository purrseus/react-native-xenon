import { enableMapSet } from 'immer';
import { createRef, memo, useImperativeHandle, useMemo } from 'react';
import { Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { FullWindowOverlay } from 'react-native-screens';
import { useImmer } from 'use-immer';
import MainContext from '../contexts/MainContext';
import refs, { DebuggerVisibility } from '../core/refs';
import { useConsoleInterceptor, useNetworkInterceptor } from '../hooks';
import colors from '../theme/colors';
import { type DebuggerState } from '../types';
import { Bubble } from './components';
import IndexedStack from './components/common/IndexedStack';
import Header from './components/headers/Header';
import Panel from './components/panels/Panel';

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
      pointerEvents: 'box-none',
      top: undefined,
      bottom: undefined,
      ...(Platform.OS === 'android' ? { zIndex: 9999 } : {}),
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

      const [debuggerState, setDebuggerState] = useImmer<DebuggerState>({
        position: 'bottom',
        detailsData: null,
      });

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
        // Disable console log tracking in development to prevent infinite loops
        // autoEnabled: __DEV__ ? false : autoInspectConsoleEnabled,
        autoEnabled: autoInspectConsoleEnabled,
      });

      useImperativeHandle(ref, () => {
        const changeVisibility = (condition: boolean, value: DebuggerVisibility) => {
          if (!condition) return;

          refs.debugger.current?.setCurrentIndex(value);
        };

        return {
          isVisible() {
            return refs.debugger.current?.getCurrentIndex() !== DebuggerVisibility.Hidden;
          },
          show() {
            changeVisibility(!this.isVisible(), DebuggerVisibility.Bubble);
          },
          hide() {
            changeVisibility(this.isVisible(), DebuggerVisibility.Hidden);
          },
        };
      }, []);

      return (
        <MainContext.Provider
          value={{ debuggerState, setDebuggerState, networkInterceptor, consoleInterceptor }}
        >
          <IndexedStack defaultIndex={DebuggerVisibility.Hidden} id="debugger" ref={refs.debugger}>
            <Bubble
              bubbleSize={bubbleSize}
              idleBubbleOpacity={idleBubbleOpacity}
              screenWidth={width}
              screenHeight={height}
            />

            <SafeAreaProvider style={containerStyle}>
              <SafeAreaView style={styles.safeArea}>
                <Header />
                <Panel />
              </SafeAreaView>
            </SafeAreaProvider>
          </IndexedStack>
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
