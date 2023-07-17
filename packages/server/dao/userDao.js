import { DataTypes } from "sequelize";
export async function userDao(sequelize){
    const User = sequelize.define("User", {
        username: DataTypes.STRING,
        password: DataTypes.STRING,
      });
    await User.sync({force: true});
    return User;
}
