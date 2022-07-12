import express from "express";
import type { Request, Response } from "express";
import * as DivisionService from "./division.service";
import { StatusCodes } from "http-status-codes";

export const divisionRouter = express.Router();

// GET: All divisions
divisionRouter.get("/", async (request: Request, response: Response) => {
  try {
    const divisions = await DivisionService.allDivisions();

    return response.status(StatusCodes.OK).json(divisions);
  } catch (e: any) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
  }
});

// GET: Get single division
divisionRouter.get("/:id", async (request: Request, response: Response) => {
  const id = parseInt(request.params.id, 10);

  try {
    const division = await DivisionService.getDivision(id);

    return response.status(StatusCodes.OK).json(division);
  } catch (e: any) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
  }
});
