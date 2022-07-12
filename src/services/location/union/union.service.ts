import { db } from "../../../utils/database/db.server";

type Union = {
  id: number;
  upazillaId: number;
  nameEn: string;
  nameBn: string;
  url: string | null;
};

// get all unions
export const allUnions = async (
  upazillaId: number | undefined
): Promise<Omit<Union, "url">[]> => {
  return db.union.findMany({
    where: {
      upazillaId,
    },
    select: {
      id: true,
      upazillaId: true,
      nameEn: true,
      nameBn: true,
    },
  });
};

// get union
export const getUnion = async (id: number): Promise<Union | null> => {
  return db.union.findUnique({
    where: {
      id,
    },
  });
};
