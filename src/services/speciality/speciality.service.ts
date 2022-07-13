import { db } from "../../utils/database/db.server";

type Speciality = {
  id: number;
  professionId: number;
  name: string;
  description: string | null;
};

// list
export const allSepecialities = (
  professionId: number | undefined
): Promise<Speciality[]> => {
  return db.speciality.findMany({
    where: {
      professionId,
    },
    select: {
      id: true,
      professionId: true,
      name: true,
      description: true,
    },
    orderBy: {
      name: "asc",
    },
  });
};

// create
export const createSpeciality = (
  speciality: Omit<Speciality, "id">
): Promise<Speciality> => {
  const { name, description, professionId } = speciality;
  return db.speciality.create({
    data: {
      name,
      description,
      professionId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      professionId: true,
    },
  });
};

// single
export const getSpeciality = (id: number): Promise<Speciality | null> => {
  return db.speciality.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      professionId: true,
      name: true,
      description: true,
    },
  });
};

// update
export const updateSpeciality = (
  speciality: Omit<Speciality, "id">,
  id: number
): Promise<Speciality> => {
  const { name, professionId, description } = speciality;

  return db.speciality.update({
    where: {
      id,
    },
    data: {
      professionId,
      name,
      description,
    },
    select: {
      id: true,
      professionId: true,
      name: true,
      description: true,
    },
  });
};

// delete
export const deleteSpeciality = (id: number) => {
  return db.speciality.delete({
    where: {
      id,
    },
  });
};
