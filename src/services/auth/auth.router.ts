import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as UserService from "../user/user.service";
import { StatusCodes } from "http-status-codes";

export const authRouter = express.Router();

//POST:  registration
authRouter.post(
  "/register",
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name field is required")
    .isString()
    .withMessage("Name should be string"),
  body("email")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email field is required")
    .isEmail()
    .withMessage("Email address is invalid")
    .bail()
    .custom(async (email: string) => {
      const user = await UserService.getUserByEmail(email);

      if (user) {
        return Promise.reject("Email already in use.");
      }

      return true;
    }),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone field is required")
    .isString()
    .withMessage("Invalid phone number")
    .bail()
    .custom(async (phone: string) => {
      const user = await UserService.getUserByPhone(phone);

      if (user) {
        return Promise.reject("Phone number already in use.");
      }

      return true;
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({
      min: 8,
    })
    .withMessage("Minimum password lenght is 8")
    .custom((value, { req }) => {
      if (value !== req.body.passwordConfirmation) {
        throw new Error("Passowrd confirmation is incorrect");
      }

      return true;
    }),
  body("passwordConfirmation")
    .trim()
    .notEmpty()
    .withMessage("Password confirmation field is required"),

  async (request: Request, response: Response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json(errors.array());
    }

    const user = request.body;

    try {
      const newUser = await UserService.createUser(user);
      return response.status(StatusCodes.OK).json(newUser);
    } catch (e: any) {
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
    }
  }
);
