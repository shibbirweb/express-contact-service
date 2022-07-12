import { db } from "../../../utils/database/db.server";

type Upazilla = {
  id: number;
  districtId: number;
  nameEn: string;
  nameBn: string;
  url: string | null;
};

// get all upazillas
export const allUpazillas = async (
  districtId: number | undefined
): Promise<Omit<Upazilla, "url">[]> => {
  return db.upazilla.findMany({
    where: {
      districtId,
    },
    select: {
      id: true,
      districtId: true,
      nameEn: true,
      nameBn: true,
    },
  });
};

// get single upazilla
export const getUpazilla = async (id: number): Promise<Upazilla | null> => {
  return db.upazilla.findUnique({
    where: {
      id,
    },
  });
};
