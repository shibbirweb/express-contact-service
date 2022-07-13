import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { divisionRouter } from "./services/location/division/division.router";
import { districtRouter } from "./services/location/district/district.router";
import { upazillaRouter } from "./services/location/upazilla/upazilla.router";
import { unionRouter } from "./services/location/union/union.router";
import { professionRoutes } from "./services/profession/profession.router";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const port: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(cors());
app.use(express.json());

// location routes
app.use("/api/location/divisions", divisionRouter);
app.use("/api/location/districts", districtRouter);
app.use("/api/location/upazillas", upazillaRouter);
app.use("/api/location/unions", unionRouter);

// profession routes
app.use("/api/professions", professionRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
