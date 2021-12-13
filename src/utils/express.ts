import * as express from "express";
import { OutgoingHttpHeaders } from "http";

export const writeJsonResponse = (
  res: express.Response,
  code: number,
  payload: any,
  headers?: OutgoingHttpHeaders
): void => {
  const data =
    typeof payload === "object" ? JSON.stringify(payload, null, 2) : payload;

  res.writeHead(code, { ...headers, "Content-Type": "application/json" });

  res.end(data);
};
