import Interceptor from './Interceptor';

const originalConsoleError = console.error;
const originalConsoleInfo = console.info;
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleTrace = console.trace;
const originalConsoleDebug = console.debug;
const originalConsoleTable = console.table;
const originalConsoleGroupCollapsed = console.groupCollapsed;
const originalConsoleGroupEnd = console.groupEnd;
const originalConsoleGroup = console.group;

export default class LogInterceptor extends Interceptor {
  static instance = new LogInterceptor();

  private constructor() {
    super();
  }

  private callback: ((type: string, ...args: any[]) => void) | null = null;

  setCallback(callback: typeof this.callback) {
    this.callback = callback;
    return this;
  }

  enableInterception(): void {
    if (this.isInterceptorEnabled) return;

    const callback = this.callback?.bind(this);

    console.error = function () {
      callback?.('error', arguments);

      originalConsoleError.apply(
        this,
        arguments as unknown as Parameters<typeof originalConsoleError>,
      );
    };

    console.info = function () {
      callback?.('info', arguments);

      originalConsoleInfo.apply(
        this,
        arguments as unknown as Parameters<typeof originalConsoleInfo>,
      );
    };

    console.log = function () {
      callback?.('log', arguments);

      originalConsoleLog.apply(this, arguments as unknown as Parameters<typeof originalConsoleLog>);
    };

    console.warn = function () {
      callback?.('warn', arguments);

      originalConsoleWarn.apply(
        this,
        arguments as unknown as Parameters<typeof originalConsoleWarn>,
      );
    };

    console.trace = function () {
      callback?.('trace', arguments);

      originalConsoleTrace.apply(
        this,
        arguments as unknown as Parameters<typeof originalConsoleTrace>,
      );
    };

    console.debug = function () {
      callback?.('debug', arguments);

      originalConsoleDebug.apply(
        this,
        arguments as unknown as Parameters<typeof originalConsoleDebug>,
      );
    };

    console.table = function () {
      callback?.('table', arguments);

      originalConsoleTable.apply(
        this,
        arguments as unknown as Parameters<typeof originalConsoleTable>,
      );
    };

    console.groupCollapsed = function () {
      callback?.('groupCollapsed', arguments);

      originalConsoleGroupCollapsed.apply(
        this,
        arguments as unknown as Parameters<typeof originalConsoleGroupCollapsed>,
      );
    };

    console.groupEnd = function () {
      callback?.('groupEnd', arguments);

      originalConsoleGroupEnd.apply(
        this,
        arguments as unknown as Parameters<typeof originalConsoleGroupEnd>,
      );
    };

    console.group = function () {
      callback?.('group', arguments);

      originalConsoleGroup.apply(
        this,
        arguments as unknown as Parameters<typeof originalConsoleGroup>,
      );
    };

    this.isInterceptorEnabled = true;
  }

  disableInterception(): void {
    if (!this.isInterceptorEnabled) return;

    this.isInterceptorEnabled = false;

    console.error = originalConsoleError;
    console.info = originalConsoleInfo;
    console.log = originalConsoleLog;
    console.warn = originalConsoleWarn;
    console.trace = originalConsoleTrace;
    console.debug = originalConsoleDebug;
    console.table = originalConsoleTable;
    console.groupCollapsed = originalConsoleGroupCollapsed;
    console.groupEnd = originalConsoleGroupEnd;
    console.group = originalConsoleGroup;

    this.callback = null;
  }
}
