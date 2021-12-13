export interface AppSettings {
  port: number;
}

export interface LoggerSettings {
  useMorgan: boolean;
  useMorganBody: boolean;
  useDevLogger: boolean;
}

export interface EnvSettings {
  app: AppSettings;
  logger: LoggerSettings;
}
