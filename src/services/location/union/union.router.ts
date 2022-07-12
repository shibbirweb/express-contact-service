import express from "express";
import type { Request, Response } from "express";

import * as UnionService from "./union.service";
import { StatusCodes } from "http-status-codes";

export const unionRouter = express.Router();

// GET: all unions
// Query: upazillaId
unionRouter.get("/", async (request: Request, response: Response) => {
  const { upazillaId: _upazillaId } = request.query;

  if (_upazillaId && isNaN(+_upazillaId)) {
    return response.status(StatusCodes.OK).json([]);
  }

  const upazillaId: number | undefined = _upazillaId
    ? parseInt(_upazillaId as string, 10)
    : undefined;

  try {
    const unions = await UnionService.allUnions(upazillaId);
    return response.status(StatusCodes.OK).json(unions);
  } catch (error: any) {
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(error.message);
  }
});

// GET: Single union
// Params: id
unionRouter.get("/:id", async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);

  try {
    const union = await UnionService.getUnion(id);
    return response.status(StatusCodes.OK).json(union);
  } catch (e: any) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
  }
});
