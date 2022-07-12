import { db } from "../../../utils/database/db.server";
import * as _districrs from "./districts.json";

type District = {
  id: number;
  division_id: number;
  name_en: string;
  name_bn: string;
  latitude: string;
  longitute: string;
  url: string;
};

const formatDistricts = (): District[] => {
  return _districrs.map((district) => {
    return {
      id: parseInt(district.id, 10),
      division_id: parseInt(district.division_id, 10),
      name_bn: district.name_bn,
      name_en: district.name_en,
      latitude: district.latitude,
      longitute: district.longitude,
      url: district.url,
    };
  });
};

export const districts = formatDistricts();

// seed
// should exists division_id on divisions table
export const seedDistricts = async () => {
  await Promise.all(
    districts.map((district) => {
      return db.district.create({
        data: {
          id: district.id,
          divisionId: district.division_id,
          nameEn: district.name_en,
          nameBn: district.name_bn,
          latitude: district.latitude,
          longitute: district.longitute,
          url: district.url,
        },
      });
    })
  );
};
