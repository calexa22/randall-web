import * as express from "express";
import { writeJsonResponse } from "@src/utils/express";

import { UserService } from "@src/api/services/user";

export const authenticate = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  const token = req.headers.authorization!;

  const userService = new UserService();

  userService
    .authenticate(token)
    .then((authRes) => {
      if (!(authRes as any).error) {
        res.locals.auth = {
          userId: (authRes as { userId: string }).userId,
        };

        next();
      } else {
        writeJsonResponse(res, 401, authRes);
      }
    })
    .catch((err) => {
      writeJsonResponse(res, 500, {
        error: {
          type: "internal_server_error",
          message: "Internal Server Error",
        },
      });
    });
};
