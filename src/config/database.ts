import { Sequelize } from "sequelize";
// const sequelize = new Sequelize({
//   dialect: "sqlite",
//   storage: "database.sqlite",
//   logging: false,
// });

const sequelize = new Sequelize(
  process.env.DATABASE_URL || "postgres://user:password@db:5432/shopperdb",
  {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
  }
);

export default sequelize;
