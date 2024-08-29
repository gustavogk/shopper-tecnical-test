import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

interface MeasurementAttributes {
  customerCode: string;
  imageUrl: string;
  measureValue: number;
  measureType: "WATER" | "GAS";
  measureDatetime: Date;
  hasConfirmed: boolean;
  measureUuid: string; // Campo opcional
}

interface MeasurementInstance
  extends Model<MeasurementAttributes>,
    MeasurementAttributes {}

const Measurement = sequelize.define<MeasurementInstance>(
  "measurements",
  {
    customerCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    measureValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    measureType: {
      type: DataTypes.ENUM("WATER", "GAS"),
      allowNull: false,
    },
    measureDatetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    hasConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    measureUuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Measurement.sync({ alter: true, force: true }).then(() => {
  console.log("Tabela Measurement criada");
});

export default Measurement;
