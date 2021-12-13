import bodyParser from "body-parser";
import express from "express";
import { Express } from "express-serve-static-core";
import * as OpenApiValidator from "express-openapi-validator";
import morgan from "morgan";
import morganBody from "morgan-body";
import { connector, summarise } from "swagger-routes-express";
import YAML from "yamljs";

import * as api from "@src/api/controllers";
import { expressDevLogger } from "./express_dev_logger";

export const createServer = async (): Promise<Express> => {
  const yamlSpec = "./config/openapi/spec.yml";
  const apiDefinition = YAML.load(yamlSpec);
  const apiSummary = summarise(apiDefinition);
  console.log(apiSummary);

  const server = express();

  server.use(bodyParser.json());
  server.use(
    morgan(":method :url :status :response-time ms - :res[content-length]")
  );

  morganBody(server);

  server.use(expressDevLogger);

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
      console.log(`${method}: ${descriptor[0]} : ${descriptor[1].name}`);
    },
    security: {
      bearerAuth: api.authenticate,
    },
  });

  connect(server);

  return server;
};
