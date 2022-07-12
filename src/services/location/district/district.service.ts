import { db } from "../../../utils/database/db.server";

type District = {
  id: number;
  divisionId: number;
  nameEn: string;
  nameBn: string;
  latitude: string | null;
  longitute: string | null;
  url: string | null;
};

// get all distircts
export const allDistircts = async (
  divisionId?: number
): Promise<Omit<District, "latitude" | "longitute" | "url">[]> => {
  return db.district.findMany({
    where: {
      divisionId: divisionId,
    },
    select: {
      id: true,
      divisionId: true,
      nameEn: true,
      nameBn: true,
    },
  });
};

// get single district
export const getDistrict = async (id: number): Promise<District | null> => {
  return db.district.findUnique({
    where: {
      id,
    },
  });
};
