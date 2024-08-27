import dotenv from "dotenv";
import express from "express";
import moment from "moment";
import sequelize from "./config/database";
import Measurement from "./models/Measurement";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3001;

sequelize
  .sync({ force: false })
  .then(() => {
    app.get("/", (req, res) => {});

    app.listen(PORT, () => {
      console.log(`Servidor ligado na porta http://localhost:${PORT}`);
      console.log(`Horário do servidor: ${moment().format()}`);
    });
  })
  .catch((error) => console.error("Unable to connect to the database:", error));
