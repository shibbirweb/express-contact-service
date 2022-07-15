import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const authenticateToken = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authHeader = request.headers["authorization"];

  const token: string | undefined = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return response.sendStatus(StatusCodes.UNAUTHORIZED);
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET_TOKEN as string,
    (error: any, anyData: any) => {
      console.log(error);

      if (error) {
        return response.sendStatus(StatusCodes.FORBIDDEN);
      }

      next();
    }
  );
};
