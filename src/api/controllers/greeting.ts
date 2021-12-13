import * as express from "express";
import { writeJsonResponse } from "@src/utils/express";

export const hello = (req: express.Request, res: express.Response): void => {
  const name = req.query.name || "stranger";

  writeJsonResponse(res, 200, { message: `Hello, ${name}!` });
};

export const goodbye = (req: express.Request, res: express.Response): void => {
  const userId = res.locals.auth.userId;

  writeJsonResponse(res, 200, { message: `Goodbye, ${userId}!` });
};
