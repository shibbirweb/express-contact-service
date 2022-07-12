import express from "express";
import type { Request, Response } from "express";
import * as UpazillaService from "./upazilla.service";
import { StatusCodes } from "http-status-codes";

export const upazillaRouter = express.Router();

// GET: All upazillas
upazillaRouter.get("/", async (request: Request, response: Response) => {
  const { districtId: _districtId } = request.query;

  if (_districtId && isNaN(+_districtId)) {
    return response.status(StatusCodes.OK).json([]);
  }

  const districtId: number | undefined = _districtId
    ? parseInt(_districtId as string, 10)
    : undefined;

  try {
    const upazillas = await UpazillaService.allUpazillas(districtId);
    return response.status(StatusCodes.OK).json(upazillas);
  } catch (e: any) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
  }
});
