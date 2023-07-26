import { DataTypes } from "sequelize";
export async function init(sequelize) {
  const model = sequelize.define("User", {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  });
  await model.sync({ force: true });
}


