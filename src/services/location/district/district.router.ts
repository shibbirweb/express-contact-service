import express from "express";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as DistrictService from "./district.service";

export const districtRouter = express.Router();

// GET: all districts
// Query Params: divisionId
districtRouter.get("/", async (request: Request, response: Response) => {
  // if division id is not a valid number then return empty response
  const { divisionId } = request.query;
  if (divisionId && isNaN(+divisionId)) {
    return response.status(StatusCodes.OK).json([]);
  }

  const _divisionId: number | undefined = divisionId
    ? parseInt(divisionId as string, 10)
    : undefined;

  try {
    const districts = await DistrictService.allDistircts(_divisionId);
    return response.status(StatusCodes.OK).json(districts);
  } catch (e: any) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
  }
});

// GET: Get single district
// Params: id
districtRouter.get("/:id", async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);

  try {
    const district = await DistrictService.getDistrict(id);
    return response.status(StatusCodes.OK).json(district);
  } catch (e: any) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
  }
});
