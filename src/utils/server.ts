import bodyParser from "body-parser";
import express from "express";
import { Express } from "express-serve-static-core";
import * as OpenApiValidator from "express-openapi-validator";
import morgan from "morgan";
import morganBody from "morgan-body";
import { connector, summarise } from "swagger-routes-express";
import YAML from "yamljs";

import * as api from "@src/api/controllers";
import { EnvSettings } from "@src/utils/env";
import { expressDevLogger } from "@src/utils/express_dev_logger";
import { Logger } from "winston";

export const createServer = async (
  settings: EnvSettings,
  logger: Logger
): Promise<Express> => {
  const yamlSpec = "./config/openapi/spec.yml";
  const apiDefinition = YAML.load(yamlSpec);
  const apiSummary = summarise(apiDefinition);
  logger.info(apiSummary);

  const server = express();

  server.use(bodyParser.json());

  if (settings.logger.useMorgan) {
    logger.info("using morgan logger");

    server.use(
      morgan(":method :url :status :response-time ms - :res[content-length]")
    );
  }

  if (settings.logger.useMorganBody) {
    logger.info("using morgan-body logger");
    morganBody(server);
  }

  if (settings.logger.useDevLogger) {
    logger.info("using custom dev logger");
    server.use(expressDevLogger);
  }

  server.use(
    OpenApiValidator.middleware({
      coerceTypes: true,
      apiSpec: yamlSpec,
      validateRequests: true,
      validateResponses: true,
    })
  );

  server.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      res.status(err.status).json({
        error: {
          type: "request_validation",
          message: err.message,
          errors: err.errors,
        },
      });
    }
  );

  const connect = connector(api, apiDefinition, {
    onCreateRoute: (method: string, descriptor: any[]) => {
      logger.verbose(`${method}: ${descriptor.map((d) => d.name).join(", ")}`);
    },
    security: {
      bearerAuth: api.authenticate,
    },
  });

  connect(server);

  return server;
};
