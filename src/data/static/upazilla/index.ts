import { db } from "../../../utils/database/db.server";
import * as _upazillas from "./upazillas.json";

type Upazilla = {
  id: number;
  distirct_id: number;
  name_en: string;
  name_bn: string;
  url: string;
};

const formatUpazillas = (): Upazilla[] => {
  return _upazillas.map((upazilla) => {
    return {
      id: parseInt(upazilla.id, 10),
      distirct_id: parseInt(upazilla.district_id, 10),
      name_en: upazilla.name_en,
      name_bn: upazilla.name_bn,
      url: upazilla.url,
    };
  });
};

export const upazillas = formatUpazillas();

export const seedUpazillas = async () => {
  await Promise.all(
    upazillas.map((upazilla) => {
      return db.upazilla.create({
        data: {
          id: upazilla.id,
          districtId: upazilla.distirct_id,
          nameBn: upazilla.name_bn,
          nameEn: upazilla.name_en,
          url: upazilla.url,
        },
      });
    })
  );
};
