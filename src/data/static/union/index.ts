import { db } from "../../../utils/database/db.server";
import * as _unions from "./unions.json";

type Union = {
  id: number;
  upazilla_id: number;
  name_en: string;
  name_bn: string;
  url: string;
};

const formatUnions = (): Union[] => {
  return _unions.map((union) => {
    return {
      id: parseInt(union.id, 10),
      upazilla_id: parseInt(union.upazilla_id, 10),
      name_bn: union.name_bn,
      name_en: union.name_en,
      url: union.url,
    };
  });
};

export const unions = formatUnions();

export const seedUnions = async () => {
  await Promise.all(
    unions.map((union) => {
      return db.union.create({
        data: {
          id: union.id,
          upzaillaId: union.upazilla_id,
          nameEn: union.name_en,
          nameBn: union.name_bn,
          url: union.url,
        },
      });
    })
  );
};
