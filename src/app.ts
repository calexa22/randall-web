import * as dotenv from "dotenv";
import dotenvParseVariables, { ParsedVariables } from "dotenv-parse-variables";

import { resourceLimits } from "worker_threads";

import { createServer } from "./utils/server";

class App {
  private _parsedVariables: ParsedVariables;

  constructor() {
    this._parsedVariables = this.loadEnvironmentVariables();

    console.log(this._parsedVariables.APP_PORT);
    console.log(typeof this._parsedVariables.APP_PORT);
  }

  get env(): ParsedVariables {
    return this._parsedVariables!;
  }

  start = (): void => {
    const port = this.env.APP_PORT as number;

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

  private loadEnvironmentVariables = (): ParsedVariables => {
    const output = dotenv.config({
      path: "./config/.env",
    });

    if (output.error) {
      console.error(`Error loading .env: ${output.error}`);
      throw output.error;
    } else if (!output.parsed) {
      console.error(`Error loading .env: ${output.error}`);
      throw EvalError;
    }

    return dotenvParseVariables(output.parsed);
  };
}

const app = new App();

app.start();
