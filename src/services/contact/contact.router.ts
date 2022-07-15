import express from "express";
import fs from "fs";
import type { Request, Response } from "express";
import * as ContactService from "./contact.service";
import { body, check, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { Gender } from "@prisma/client";
import multer from "multer";
import path from "path";
import sharp from "sharp";
import { getUnion } from "../location/union/union.service";
import { getUpazilla } from "../location/upazilla/upazilla.service";
import { getDistrict } from "../location/district/district.service";
import { getDivision } from "../location/division/division.service";
import { isArray } from "lodash";
import { authenticateToken } from "./../../middlewares/authenticate.middleware";

// photo upload storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

export const contactRouter = express.Router();

//GET: list
contactRouter.get(
  "/",
  authenticateToken,
  async (request: Request, response: Response) => {
    try {
      const contacts = await ContactService.allContacts();
      return response.status(StatusCodes.OK).json(contacts);
    } catch (e: any) {
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
    }
  }
);

// POST: create
contactRouter.post(
  "/",
  upload.single("photo"),
  body("unionId")
    .trim()
    .isNumeric()
    .bail()
    .toInt()
    .custom(async (value) => {
      const id: number = parseInt(value, 10);
      const union = await getUnion(id);

      if (!union) {
        return Promise.reject("Union id is not valid.");
      }

      return true;
    }),
  body("upazillaId")
    .trim()
    .isNumeric()
    .bail()
    .toInt()
    .custom(async (value) => {
      const id: number = parseInt(value, 10);
      const upazilla = await getUpazilla(id);
      if (!upazilla) {
        return Promise.reject("upazilla id is not valid.");
      }
      return true;
    }),
  body("districtId")
    .trim()
    .isNumeric()
    .bail()
    .toInt()
    .custom(async (value) => {
      const id: number = parseInt(value, 10);
      const district = await getDistrict(id);
      if (!district) {
        return Promise.reject("district id is not valid.");
      }
      return true;
    }),
  body("divisionId")
    .trim()
    .isNumeric()
    .bail()
    .toInt()
    .custom(async (value) => {
      const id: number = parseInt(value, 10);
      const division = await getDivision(id);
      if (!division) {
        return Promise.reject("division id is not valid.");
      }
      return true;
    }),
  body("professionIds")
    .trim()
    .customSanitizer((value: string) => {
      return value.split(",").map((id) => {
        return parseInt(id, 10);
      });
    }),
  body("specialityIds")
    .trim()
    .customSanitizer((value: string) => {
      return value.split(",").map((id) => {
        return parseInt(id, 10);
      });
    }),
  body("firstName").trim().isString(),
  body("lastName").trim().isString(),
  body("dateOfBirth").trim().optional({ nullable: true }).isDate().toDate(),
  body("nid").trim().optional({ nullable: true }).isString(),
  check("photo")
    // .optional({ nullable: true })
    .custom((value, { req }) => {
      const photo: undefined | object = req.file;

      if (!photo) {
        return Promise.reject("Photo is required.");
      }

      return true;
    }),
  body("address").trim().isString(),
  body("mobileNumberPrimary").trim().isString(),
  body("mobileNumberSecondary").trim().isString(),
  body("email").trim().optional({ nullable: true }).normalizeEmail().isEmail(),
  body("gender")
    .trim()
    .isString()
    .isIn([Gender.Male, Gender.Female, Gender.Others]),

  async (request: Request, response: Response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      if (request?.file?.path) {
        fs.unlinkSync(request?.file?.path);
      }
      return response
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json(errors.array());
    }

    const contact = request.body;

    try {
      const photo = request.file;
      if (photo?.path) {
        // resized extension
        const extension = path.extname(photo.path);
        // resized file path
        const resizedPhotoUrl = photo.path
          .replace(extension, "")
          .concat(`-resized${extension}`);

        // resize
        await sharp(photo.path)
          .resize(300, 300, {
            fit: "fill",
          })
          .jpeg({
            quality: 80,
          })
          .toFile(path.resolve(resizedPhotoUrl));

        // delete original
        await fs.unlinkSync(photo.path);

        contact.photo = resizedPhotoUrl;
      }

      const createdContact = await ContactService.createContact(contact);
      return response.status(StatusCodes.OK).json(createdContact);
    } catch (e: any) {
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
    }
  }
);

// PUT: Update
contactRouter.put(
  "/:id",
  upload.single("photo"),
  body("unionId")
    .trim()
    .isNumeric()
    .bail()
    .toInt()
    .custom(async (value) => {
      const id: number = parseInt(value, 10);
      const union = await getUnion(id);

      if (!union) {
        return Promise.reject("Union id is not valid.");
      }

      return true;
    }),
  body("upazillaId")
    .trim()
    .isNumeric()
    .bail()
    .toInt()
    .custom(async (value) => {
      const id: number = parseInt(value, 10);
      const upazilla = await getUpazilla(id);
      if (!upazilla) {
        return Promise.reject("upazilla id is not valid.");
      }
      return true;
    }),
  body("districtId")
    .trim()
    .isNumeric()
    .bail()
    .toInt()
    .custom(async (value) => {
      const id: number = parseInt(value, 10);
      const district = await getDistrict(id);
      if (!district) {
        return Promise.reject("district id is not valid.");
      }
      return true;
    }),
  body("divisionId")
    .trim()
    .isNumeric()
    .bail()
    .toInt()
    .custom(async (value) => {
      const id: number = parseInt(value, 10);
      const division = await getDivision(id);
      if (!division) {
        return Promise.reject("division id is not valid.");
      }
      return true;
    }),
  body("professionIds")
    .trim()
    .customSanitizer((value: string) => {
      return value.split(",").map((id) => {
        return parseInt(id, 10);
      });
    }),
  body("specialityIds")
    .trim()
    .customSanitizer((value: string) => {
      return value.split(",").map((id) => {
        return parseInt(id, 10);
      });
    }),
  body("firstName").trim().isString(),
  body("lastName").trim().isString(),
  body("dateOfBirth").trim().optional({ nullable: true }).isDate().toDate(),
  body("nid").trim().optional({ nullable: true }).isString(),
  check("photo")
    // .optional({ nullable: true })
    .custom((value, { req }) => {
      const photo: undefined | object = req.file;

      if (!photo) {
        return Promise.reject("Photo is required.");
      }

      return true;
    }),
  body("address").trim().isString(),
  body("mobileNumberPrimary").trim().isString(),
  body("mobileNumberSecondary").trim().isString(),
  body("email").trim().optional({ nullable: true }).normalizeEmail().isEmail(),
  body("gender")
    .trim()
    .isString()
    .isIn([Gender.Male, Gender.Female, Gender.Others]),

  async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      if (request?.file?.path) {
        fs.unlinkSync(request?.file?.path);
      }
      return response
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json(errors.array());
    }

    const contact = request.body;

    try {
      const photo = request.file;

      // get contact details
      const _contact = await ContactService.getContact(id);

      if (photo?.path) {
        // resized extension
        const extension = path.extname(photo.path);
        // resized file path
        const resizedPhotoUrl = photo.path
          .replace(extension, "")
          .concat(`-resized${extension}`);

        // resize
        await sharp(photo.path)
          .resize(300, 300, {
            fit: "fill",
          })
          .jpeg({
            quality: 80,
          })
          .toFile(path.resolve(resizedPhotoUrl));

        // delete original
        await fs.unlinkSync(photo.path);

        contact.photo = resizedPhotoUrl;
      }

      const updatedContact = await ContactService.updateContact(contact, id);

      // delete old photo
      if (_contact?.photo) {
        // delete old photo
        await fs.unlinkSync(_contact.photo);
      }
      return response.status(StatusCodes.OK).json(updatedContact);
    } catch (e: any) {
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
    }
  }
);

// GET: Single
contactRouter.get("/:id", async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);
  try {
    const contact = await ContactService.getContact(id);
    return response.status(StatusCodes.OK).json(contact);
  } catch (e: any) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
  }
});

// DELETE: delete contact
contactRouter.delete("/:id", async (request: Request, response: Response) => {
  const id: number = parseInt(request.params.id, 10);
  try {
    // delete photo
    const contact = await ContactService.getContact(id);

    if (contact?.photo) {
      await fs.unlinkSync(contact.photo);
    }

    await ContactService.deleteContact(id);

    return response
      .status(StatusCodes.NO_CONTENT)
      .json("Deleted successfully.");
  } catch (e: any) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
  }
});
