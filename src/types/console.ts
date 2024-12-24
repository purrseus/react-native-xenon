export interface LogMessage {
  type: string;
  values: any[];
}

export interface ConsoleHandlers {
  callback: ((type: string, args: any[]) => void) | null;
}
