import express from "express";
import type { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import * as SpecialityService from "./speciality.service";
import { getProfession } from "../profession/profession.service";
import { StatusCodes } from "http-status-codes";

export const specialityRouter = express.Router();

// GET: list
specialityRouter.get("/", async (request: Request, response: Response) => {
  const { professionId: _professionId } = request.query;

  if (_professionId && isNaN(+_professionId)) {
    return response.status(StatusCodes.OK).json([]);
  }

  const professionId: number | undefined = _professionId
    ? parseInt(_professionId as string, 10)
    : undefined;

  try {
    const speciliaties = await SpecialityService.allSepecialities(professionId);
    return response.status(StatusCodes.OK).json(speciliaties);
  } catch (e: any) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
  }
});

// POST: Create
specialityRouter.post(
  "/",
  check("name").isString().withMessage("Name field is required"),
  check("professionId")
    .isNumeric()
    .withMessage("Invalid profession id")
    .bail()
    .custom(async (value: string) => {
      const id: number = parseInt(value, 10);
      const profession = await getProfession(id);

      if (!profession) {
        return Promise.reject("Profession id is invalid");
      }

      return true;
    }),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json(errors.array());
    }

    const spciality = request.body;
    try {
      const newSpeciality = await SpecialityService.createSpeciality(spciality);
      return response.status(StatusCodes.OK).json(newSpeciality);
    } catch (e: any) {
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
    }
  }
);

// GET: single
specialityRouter.get("/:id", async (request: Request, response: Response) => {
  const { id: _id } = request.params;

  if (isNaN(+_id)) {
    return response.status(StatusCodes.NOT_FOUND).json("Not found");
  }

  const id: number = parseInt(_id, 10);

  try {
    const speciality = await SpecialityService.getSpeciality(id);
    return response.status(StatusCodes.OK).json(speciality);
  } catch (e: any) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
  }
});

// PUT: update
specialityRouter.put(
  "/:id",
  check("name").isString().withMessage("Name field is requried"),
  check("professionId")
    .isNumeric()
    .bail()
    .custom(async (value) => {
      const id: number = parseInt(value, 10);
      const profession = await getProfession(id);

      if (!profession) {
        return Promise.reject("Invalid profession id.");
      }

      return true;
    }),
  async (request: Request, response: Response) => {
    const { id: _id } = request.params;

    if (isNaN(+_id)) {
      return response.status(StatusCodes.NOT_FOUND).json("Not found");
    }

    const id: number = parseInt(_id, 10);

    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json(errors.array());
    }

    const speciality = request.body;
    try {
      const updatedSpeciality = await SpecialityService.updateSpeciality(
        speciality,
        id
      );
      return response.status(StatusCodes.OK).json(updatedSpeciality);
    } catch (e: any) {
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
    }
  }
);

// DELETE: delete
specialityRouter.delete(
  "/:id",
  async (request: Request, response: Response) => {
    const { id: _id } = request.params;

    if (isNaN(+_id)) {
      return response.status(StatusCodes.NOT_FOUND).json("Not found");
    }

    const id: number = parseInt(_id, 10);

    try {
      await SpecialityService.deleteSpeciality(id);

      return response
        .status(StatusCodes.NO_CONTENT)
        .json("Deleted successfully.");
    } catch (e: any) {
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
    }
  }
);
