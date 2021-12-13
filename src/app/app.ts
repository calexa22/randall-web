import * as dotenv from "dotenv";
import dotenvParseVariables from "dotenv-parse-variables";
import { createServer } from "@src/utils/server";
import { getEnvSettings, EnvSettings } from "@src/utils/env";
import { createLogger } from "@src/utils/logger";
import { Logger } from "winston";

class App {
  private _settings: EnvSettings;
  private _logger: Logger;

  constructor() {
    this._settings = this.loadEnvironmentVariables();
    this._logger = this.createAppLogger();
  }

  get settings(): EnvSettings {
    return this._settings;
  }

  get logger(): Logger {
    return this._logger;
  }

  start = (): void => {
    const port = this._settings.app.port;

    createServer(this._settings, this._logger)
      .then((server) => {
        server.listen(port, () => {
          this._logger.info(`Listening on http://localhost:${port}`);
        });
      })
      .catch((err) => {
        this._logger.error(`App Error: ${err}`);
      });
  };

  private loadEnvironmentVariables = (): EnvSettings => {
    const output = dotenv.config({
      path: "./config/.env",
    });

    if (output.error) {
      console.error(`Error loading .env: ${output.error}`);
      throw output.error;
    } else if (!output.parsed) {
      console.error(`Error loading .env: ${output.error}`);
      throw Error("Error parsing .env:");
    }

    return getEnvSettings(dotenvParseVariables(output.parsed));
  };

  private createAppLogger = (): Logger => {
    const logger = createLogger(this._settings.logger.logLevel);

    logger.info(`Logger created - Level: ${logger.level}`);
    return logger;
  };
}

export const app = new App();
