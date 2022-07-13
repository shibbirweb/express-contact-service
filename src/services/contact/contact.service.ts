import { db } from "../../utils/database/db.server";
import type { Contact } from "@prisma/client";

type ContactResponse = Omit<
  Contact,
  "createdAt" | "updatedAt" | "deactivatedAt"
>;

type ContactRequest = Partial<Omit<Contact, "id">> & {
  professionIds: number[];
  specialityIds: number[];
};

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
    professionIds: _professionIds,
    specialityIds: _spcialityIds,
  } = contact;

  // many to many id type
  type ManyToManyConnectId = {
    id: number;
  };

  // format profession ids
  const professionIds: ManyToManyConnectId[] = _professionIds.map(
    (professionId) => {
      return {
        id: professionId,
      };
    }
  );

  // format speciality ids
  const specialityIds: ManyToManyConnectId[] = _spcialityIds.map(
    (specialityId) => {
      return {
        id: specialityId,
      };
    }
  );

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

      professions: {
        connect: professionIds,
      },

      specialities: {
        connect: specialityIds,
      },
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

// Single
export const getContact = (id: number): Promise<ContactResponse | null> => {
  return db.contact.findUnique({
    where: {
      id,
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
      union: {
        select: {
          id: true,
          nameBn: true,
          nameEn: true,
        },
      },
      upazilla: {
        select: {
          id: true,
          nameBn: true,
          nameEn: true,
        },
      },
      district: {
        select: {
          id: true,
          nameBn: true,
          nameEn: true,
        },
      },
      division: {
        select: {
          id: true,
          nameBn: true,
          nameEn: true,
        },
      },
      professions: {
        select: {
          id: true,
          name: true,
        },
      },
      specialities: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

// Delete
export const deleteContact = (id: number) => {
  return db.contact.delete({
    where: {
      id,
    },
  });
};
