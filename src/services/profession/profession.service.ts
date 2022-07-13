import { db } from "../../utils/database/db.server";

type Profession = {
  id: number;
  name: string;
  description?: string | null;
};

// get all profession
export const allProfessions = (): Promise<
  Omit<Profession, "description">[]
> => {
  return db.profession.findMany({
    select: {
      id: true,
      name: true,
    },
  });
};

// Create profession
export const createProfession = (
  profession: Omit<Profession, "id">
): Promise<Profession> => {
  const { name, description } = profession;

  return db.profession.create({
    data: {
      name,
      description,
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });
};

// Details Profession
export const getProfession = (id: number): Promise<Profession | null> => {
  return db.profession.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });
};

// Update profession
export const updateProfession = (
  profession: Omit<Profession, "id">,
  id: number
): Promise<Profession> => {
  const { name, description } = profession;

  return db.profession.update({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
    data: {
      name,
      description,
    },
  });
};

// Delete profession
export const deleteProfession = (id: number) => {
  return db.profession.delete({
    where: {
      id,
    },
  });
};
