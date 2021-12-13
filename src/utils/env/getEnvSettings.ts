import { EnvSettings } from "./types";
import { ParsedVariables } from "dotenv-parse-variables";

export const getEnvSettings = (parsedVars: ParsedVariables): EnvSettings => {
  return {
    app: {
      port: parsedVars.APP_PORT as number,
    },
    logger: {
      useDevLogger: parsedVars.DEV_LOGGER as boolean,
      useMorgan: parsedVars.MORGAN_LOGGER as boolean,
      useMorganBody: parsedVars.MORGAN_BODY_LOGGER as boolean,
    },
  };
};
