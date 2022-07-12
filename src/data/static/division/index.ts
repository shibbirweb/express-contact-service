import * as _divisions from "./divisions.json";
import { db } from "../../../utils/database/db.server";

type Division = {
  id: number;
  name_en: string;
  name_bn: string;
  url: string | null;
};

const formatDivisions = (): Division[] => {
  return _divisions.map((division) => {
    return {
      id: parseInt(division.id, 10),
      name_en: division.name_en,
      name_bn: division.name_bn,
      url: division.url,
    };
  });
};

export const divisions = formatDivisions();

// seed
export const seedDivisions = async () => {
  await Promise.all(
    divisions.map((division) => {
      return db.division.create({
        data: {
          id: division.id,
          nameBn: division.name_bn,
          nameEn: division.name_en,
          url: division.url,
        },
      });
    })
  );
};
