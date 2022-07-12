import { db } from "../../../utils/database/db.server";
import * as _unions from "./unions.json";
import _ from "lodash";

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

// Seed
export const seedUnions = async () => {
  for (let i = 0; i < unions.length; i++) {
    const union = unions[i];
    await db.union.create({
      data: {
        id: union.id,
        upzaillaId: union.upazilla_id,
        nameEn: union.name_en,
        nameBn: union.name_bn,
        url: union.url,
      },
    });
  }
};
