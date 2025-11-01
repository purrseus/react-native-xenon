import { enableMapSet } from 'immer';
import { createRef, memo, useImperativeHandle, type JSX, type ReactNode } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';
import { useImmer } from 'use-immer';
import { MainContext } from '../contexts';
import refs, { DebuggerVisibility } from '../core/refs';
import { useConsoleInterceptor, useNetworkInterceptor } from '../hooks';
import { type DebuggerState } from '../types';
import { Bubble, IndexedStack, Panel, SearchBar } from './components';

namespace Xenon {
  export interface Methods {
    isVisible(): boolean;
    show(): void;
    hide(): void;
  }

  export interface Props {
    children: ReactNode;
    /**
     * If true, completely disables the debugger by rendering only the children components without any debugging functionality.
     * @default false
     */
    disabled?: boolean;
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

  enableMapSet();
  const ref = createRef<Methods>();

  /**
   * Checks whether the debugger is currently visible.
   * @returns `true` if the debugger is currently visible, otherwise `false`.
   */
  export const isVisible = (): boolean => ref.current?.isVisible() ?? false;

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

  const Debugger = memo<Omit<Props, 'children' | 'disabled'>>(
    ({
      autoInspectNetworkEnabled = true,
      autoInspectConsoleEnabled = true,
      bubbleSize = 40,
      idleBubbleOpacity = 0.5,
      includeDomains,
    }) => {
      const dimensions = useWindowDimensions();

      const [debuggerState, setDebuggerState] = useImmer<DebuggerState>({
        position: 'bottom',
        detailsData: null,
        searchQuery: '',
      });

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
          value={{
            dimensions,
            debuggerState,
            setDebuggerState,
            networkInterceptor,
            consoleInterceptor,
          }}
        >
          <IndexedStack defaultIndex={DebuggerVisibility.Hidden} id="debugger" ref={refs.debugger}>
            <Bubble bubbleSize={bubbleSize} idleBubbleOpacity={idleBubbleOpacity} />

            <Panel />

            <SearchBar />
          </IndexedStack>
        </MainContext.Provider>
      );
    },
    (prevProps, nextProps) =>
      prevProps.autoInspectNetworkEnabled === nextProps.autoInspectNetworkEnabled &&
      prevProps.autoInspectConsoleEnabled === nextProps.autoInspectConsoleEnabled &&
      prevProps.bubbleSize === nextProps.bubbleSize &&
      prevProps.idleBubbleOpacity === nextProps.idleBubbleOpacity &&
      JSON.stringify(prevProps.includeDomains) === JSON.stringify(nextProps.includeDomains),
  );

  export function Wrapper({ disabled = false, children, ...props }: Props): JSX.Element {
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
