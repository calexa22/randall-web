import * as dotenv from "dotenv";
import dotenvParseVariables from "dotenv-parse-variables";
import { createServer } from "@src/utils/server";
import { getEnvSettings, EnvSettings } from "@src/utils/env";


class App {
  private _settings: EnvSettings;

  constructor() {
    this._settings = this.loadEnvironmentVariables();

    console.log(this._settings.app.port);
    console.log(typeof this._settings.app.port);
  }

  get settings(): EnvSettings {
    return this._settings;
  }

  start = (): void => {
    const port = this._settings.app.port;

    createServer()
      .then((server) => {
        server.listen(port, () => {
          console.log(`Listening on http://localhost:${port}`);
        });
      })
      .catch((err) => {
        console.error(`App Error: ${err}`);
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
}

const app = new App();

app.start();
