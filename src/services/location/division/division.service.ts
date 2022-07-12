import { db } from "../../../utils/database/db.server";

type Division = {
  id: number;
  nameEn: string;
  nameBn: string;
  url: string | null;
};

// Get all divisions
export const allDivisions = async (): Promise<Omit<Division, "url">[]> => {
  return db.division.findMany({
    select: {
      id: true,
      nameBn: true,
      nameEn: true,
    },
  });
};

// Get single division
export const getDivision = async (id: number): Promise<Division | null> => {
  return db.division.findUnique({
    where: {
      id,
    },
  });
};
