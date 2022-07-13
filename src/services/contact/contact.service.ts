import { db } from "../../utils/database/db.server";
import type { Contact } from "@prisma/client";

type ContactResponse = Omit<
  Contact,
  "createdAt" | "updatedAt" | "deactivatedAt"
>;

type ContactRequest = Omit<Contact, "id">;

// list
export const allContacts = (): Promise<ContactResponse[]> => {
  return db.contact.findMany({
    select: {
      id: true,
      unionId: true,
      upazillaId: true,
      districtId: true,
      divisionId: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      nid: true,
      photo: true,
      address: true,
      mobileNumberPrimary: true,
      mobileNumberSecondary: true,
      email: true,
      gender: true,
    },
  });
};

// create
export const createContact = (
  contact: ContactRequest
): Promise<ContactResponse> => {
  const {
    unionId,
    upazillaId,
    districtId,
    divisionId,
    firstName,
    lastName,
    dateOfBirth,
    nid,
    photo,
    address,
    mobileNumberPrimary,
    mobileNumberSecondary,
    email,
    gender,
  } = contact;

  return db.contact.create({
    data: {
      unionId,
      upazillaId,
      districtId,
      divisionId,
      firstName,
      lastName,
      dateOfBirth,
      nid,
      photo,
      address,
      mobileNumberPrimary,
      mobileNumberSecondary,
      email,
      gender,
    },
    select: {
      id: true,
      unionId: true,
      upazillaId: true,
      districtId: true,
      divisionId: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      nid: true,
      photo: true,
      address: true,
      mobileNumberPrimary: true,
      mobileNumberSecondary: true,
      email: true,
      gender: true,
    },
  });
};
