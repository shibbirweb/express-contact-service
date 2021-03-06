import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { divisionRouter } from "./services/location/division/division.router";
import { districtRouter } from "./services/location/district/district.router";
import { upazillaRouter } from "./services/location/upazilla/upazilla.router";
import { unionRouter } from "./services/location/union/union.router";
import { professionRoutes } from "./services/profession/profession.router";
import { specialityRouter } from "./services/speciality/speciality.router";
import { contactRouter } from "./services/contact/contact.router";
import { authRouter } from "./services/auth/auth.router";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const port: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(morgan("dev")); // only in development environment
app.use(cors());
app.use(express.json());

// location routes
app.use("/api/location/divisions", divisionRouter);
app.use("/api/location/districts", districtRouter);
app.use("/api/location/upazillas", upazillaRouter);
app.use("/api/location/unions", unionRouter);

// profession routes
app.use("/api/professions", professionRoutes);
// specilitie routes
app.use("/api/specialities", specialityRouter);
// contact routes
app.use("/api/contacts", contactRouter);
// auth routes
app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
