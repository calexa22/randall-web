import express from "express";
import { app } from "@src/app";

export const expressDevLogger = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  const logger = app.logger;

  const startHrTime = process.hrtime();

  logger.http(
    `Request: ${req.method} ${
      req.url
    } as ${new Date().toUTCString()}, User-Agent: ${req.get("User-Agent")}`
  );

  logger.http(`Request Body: ${JSON.stringify(req.body)}`);

  const [oldWrite, oldEnd] = [res.write, res.end];

  const chunks: Buffer[] = [];

  (res.write as unknown) = function (chunk: any): void {
    chunks.push(Buffer.from(chunk));
    (oldWrite as Function).apply(res, arguments);
  };

  res.end = function (chunk: any): void {
    if (chunk) chunks.push(Buffer.from(chunk));

    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = elapsedHrTime[0] * 100 + elapsedHrTime[1] / 1e6;

    logger.http(`Response ${res.statusCode} ${elapsedTimeInMs.toFixed(3)} ms`);

    const body = Buffer.concat(chunks).toString("utf8");
    logger.http(`Response Body: ${body}`);

    (oldEnd as Function).apply(res, arguments);
  };

  next();
};
