export interface AppSettings {
  port: number;
}

export enum LogLevel {
  Silent = "silent",
  Error = "error",
  Warn = "warn",
  Info = "info",
  Http = "http",
  Verbose = "verbose",
  Debug = "debug",
  Silly = "silly",
}

export interface LoggerSettings {
  useMorgan: boolean;
  useMorganBody: boolean;
  useDevLogger: boolean;
  logLevel: LogLevel;
}

export interface EnvSettings {
  app: AppSettings;
  logger: LoggerSettings;
}
