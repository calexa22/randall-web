import winston, { format, transports } from "winston";
import { LogLevel } from "@src/utils/env";

const pretifyJson = format.printf((info) => {
  if (info.message.constructor === Object) {
    info.message = JSON.stringify(info.message, undefined, 4);
  }

  return `${info.timestamp} ${info.label || "-"} ${info.level}: ${
    info.message
  }`;
});

export const createLogger = (logLevel: LogLevel): winston.Logger => {
  const winstonLevel =
    logLevel === LogLevel.Silent ? undefined : logLevel.toString();

  return winston.createLogger({
    level: winstonLevel,
    silent: logLevel === LogLevel.Silent,
    format: format.combine(
      format.colorize(),
      format.prettyPrint(),
      format.splat(),
      format.simple(),
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
      pretifyJson
    ),
    defaultMeta: { service: "randall-web" },
    transports: [new transports.Console()],
  });
};
