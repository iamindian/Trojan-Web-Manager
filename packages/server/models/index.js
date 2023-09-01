import { Sequelize, DataTypes } from "sequelize";
import { User } from "./User.model.js";
const sequelize = new Sequelize("trojan", "root", "Ilove1225!", {
  dialect: "mysql",
  pool: {
    max: 5,
    idle: 30000,
    acquire: 60000,
  },
});
await User(sequelize);
export { sequelize };
