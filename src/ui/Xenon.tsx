import { enableMapSet } from 'immer';
import { createRef, memo, useImperativeHandle, useMemo, type JSX, type ReactNode } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FullWindowOverlay } from 'react-native-screens';
import { useImmer } from 'use-immer';
import { MainContext } from '../contexts';
import refs, { DebuggerVisibility } from '../core/refs';
import { useConsoleInterceptor, useNetworkInterceptor } from '../hooks';
import colors from '../theme/colors';
import { type DebuggerState } from '../types';
import { Bubble, Header, IndexedStack, Panel, SearchBar } from './components';
import SafeArea from './components/common/SafeArea';

namespace Xenon {
  interface Methods {
    isVisible(): boolean;
    show(): void;
    hide(): void;
  }

  interface Props {
    /**
     * Determines whether the network inspector is automatically enabled upon initialization.
     * @default true
     */
    autoInspectNetworkEnabled?: boolean;
    /**
     * Determines whether the console inspector is automatically enabled upon initialization.
     * @default true
     */
    autoInspectConsoleEnabled?: boolean;
    /**
     * Defines the size of the interactive bubble used in the UI.
     * @default 40
     */
    bubbleSize?: number;
    /**
     * Defines the opacity level of the bubble when it is idle.
     * @default 0.5
     */
    idleBubbleOpacity?: number;
    /**
     * Domains to include in network interception. Defaults to all domains.
     * @default undefined
     * @example ['example1.com', 'api.example2.com']
     */
    includeDomains?: string[];
  }

  interface WrapperProps extends Props {
    /**
     * If true, completely disables the debugger by rendering only the children components without any debugging functionality.
     * @default false
     */
    disabled?: boolean;
    children: ReactNode;
  }

  enableMapSet();
  const ref = createRef<Methods>();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      ...StyleSheet.absoluteFillObject,
      pointerEvents: 'box-none',
      ...(Platform.OS === 'android' ? { zIndex: 9999 } : {}),
      top: undefined,
      bottom: undefined,
      backgroundColor: colors.lightGray,
      borderBottomColor: colors.gray,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    safeArea: {
      flex: 1,
    },
  });

  /**
   * Checks whether the debugger is currently visible.
   * @returns `true` if the debugger is currently visible, otherwise `false`.
   */
  export const isVisible = () => ref.current?.isVisible() ?? false;

  /**
   * Makes the debugger visible. If it is already visible, this method has no additional effect.
   * @returns `void`
   */
  export const show = (): void => ref.current?.show();

  /**
   * Hides the debugger. If it is already hidden, this method has no additional effect.
   * @returns `void`
   */
  export const hide = (): void => ref.current?.hide();

  const Debugger = memo(
    ({
      autoInspectNetworkEnabled = true,
      autoInspectConsoleEnabled = true,
      bubbleSize = 40,
      idleBubbleOpacity = 0.5,
      includeDomains,
    }: Props) => {
      const { width, height } = useWindowDimensions();

      const [debuggerState, setDebuggerState] = useImmer<DebuggerState>({
        position: 'bottom',
        detailsData: null,
        searchQuery: '',
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
        includeDomains,
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

            <View style={containerStyle}>
              <SafeAreaProvider>
                {debuggerState.position === 'top' && <SafeArea inset="top" />}
                <Header />
                <Panel />
                {debuggerState.position === 'bottom' && <SafeArea inset="bottom" />}
              </SafeAreaProvider>
            </View>

            <SearchBar />
          </IndexedStack>
        </MainContext.Provider>
      );
    },
  );

  export function Wrapper({ disabled = false, children, ...props }: WrapperProps): JSX.Element {
    if (disabled) return children as JSX.Element;

    return (
      <>
        {children}
        {Platform.OS === 'ios' ? (
          <FullWindowOverlay>
            <Debugger {...props} />
          </FullWindowOverlay>
        ) : (
          <Debugger {...props} />
        )}
      </>
    );
  }

  Wrapper.displayName = 'Xenon';
}

export default Xenon;
