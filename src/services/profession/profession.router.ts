import express from "express";
import type { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import * as ProfessionService from "./profession.service";
import { StatusCodes } from "http-status-codes";

export const professionRoutes = express.Router();

// GET: get all professions
professionRoutes.get("/", async (request: Request, response: Response) => {
  try {
    const professions = await ProfessionService.allProfessions();
    return response.status(StatusCodes.OK).json(professions);
  } catch (e: any) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
  }
});

// POST: create new profession
professionRoutes.post(
  "/",
  check("name").isString().withMessage("Name field is requried."),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json(errors.array());
    }

    const profession = request.body;

    try {
      const newProfession = await ProfessionService.createProfession(
        profession
      );
      return response.status(StatusCodes.OK).json(newProfession);
    } catch (e: any) {
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
    }
  }
);

// GET: Single Profession
professionRoutes.get("/:id", async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);

  try {
    const profession = await ProfessionService.getProfession(id);
    return response.status(StatusCodes.OK).json(profession);
  } catch (e: any) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
  }
});

// PUT: Update profession
professionRoutes.put(
  "/:id",
  check("name").isString().withMessage("Name field is required"),
  async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json(errors.array());
    }

    const profession = request.body;

    try {
      const updatedProfession = await ProfessionService.updateProfession(
        profession,
        id
      );
      return response.status(StatusCodes.OK).json(updatedProfession);
    } catch (e: any) {
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
    }
  }
);

// Delete: Delete a profession
professionRoutes.delete(
  "/:id",
  async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
      await ProfessionService.deleteProfession(id);
      return response
        .status(StatusCodes.NO_CONTENT)
        .json("Profession deleted successfully.");
    } catch (e: any) {
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
    }
  }
);
