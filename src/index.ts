import dotenv from "dotenv";
import express from "express";
import moment from "moment";
import sequelize from "./config/database";
import Measurement from "./models/Measurement";
import apiRouter from "./routes/apiRouter";
import path from "path";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

sequelize
  .sync({ force: false })
  .then(() => {
    app.use(express.json());
    app.use(express.static(path.join(__dirname, "../../public")));
    app.use("/", apiRouter);

    app.listen(PORT, () => {
      console.log(`Servidor ligado na porta http://localhost:${PORT}`);
      console.log(`Horário do servidor: ${moment().format()}`);
    });
  })
  .catch((error) => console.error("Unable to connect to the database:", error));
