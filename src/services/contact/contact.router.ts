import express from "express";
import type { Request, Response } from "express";
import * as ContactService from "./contact.service";
import { body, check, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { Gender } from "@prisma/client";

export const contactRouter = express.Router();

//GET: list
contactRouter.get("/", async (request: Request, response: Response) => {
  try {
    const contacts = await ContactService.allContacts();
    return response.status(StatusCodes.OK).json(contacts);
  } catch (e: any) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
  }
});

// POST: create
contactRouter.post(
  "/",
  body("unionId").isNumeric(),
  body("upazillaId").isNumeric(),
  body("districtId").isNumeric(),
  body("divisionId").isNumeric(),
  body("firstName").isString(),
  body("lastName").isString(),
  body("dateOfBirth").optional({ nullable: true }).isDate().toDate(),
  body("nid").optional({ nullable: true }).isString(),
  //   body("photo").isString(),
  body("address").isString(),
  body("mobileNumberPrimary").isString(),
  body("mobileNumberSecondary").isString(),
  body("email").optional({ nullable: true }).trim().normalizeEmail().isEmail(),
  body("gender").isString().isIn([Gender.Male, Gender.Female, Gender.Others]),
  async (request: Request, response: Response) => {
    // Validation
    const errors = validationResult(request);

    return response.status(200).json(request.headers);
    if (!errors.isEmpty()) {
      return response
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json(errors.array());
    }

    const contact = request.body;

    try {
      const createdContact = await ContactService.createContact(contact);
      return response.status(StatusCodes.OK).json(createdContact);
    } catch (e: any) {
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
    }
  }
);
