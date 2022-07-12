import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { divisionRouter } from "./services/location/division/division.router";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const port: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/location/divisions", divisionRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
