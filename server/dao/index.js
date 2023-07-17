import { Sequelize, DataTypes } from "sequelize";
import { userDao } from "./userDao.js";
const sequelize = new Sequelize("trojan", "root", "Ilove1225!", {
  dialect: "mysql",
  pool: {
    max: 5,
    idle: 30000,
    acquire: 60000,
  },
});
const User = await userDao(sequelize);
export { User };
