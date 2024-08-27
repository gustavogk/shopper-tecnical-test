import sequelize from "../config/database";
import { DataTypes } from "sequelize";

const Measurement = sequelize.define(
  "measurements",
  {
    customerCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    measureValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    measureType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    measureDatetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    hasConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Measurement.sync({ alter: false, force: false }).then(() => {
  console.log("Tabela Measurement criada");
});

export default Measurement;
