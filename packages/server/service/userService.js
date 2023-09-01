
import { ssh224 } from "../utils/index.js";
import { QueryTypes } from "sequelize"
let sequelize = null;
export async function init(sequelizeInstance) {
  sequelize = sequelizeInstance;
}
export async function getUsers() {
  const users = await sequelize.models.User.findAll();
  return users;
}
export async function addUser(username, password) {
  const User = sequelize.models.User;
  return await User.create({ username, password: ssh224(username, password) });
}
export async function getUserExpiration(username, password) {
  return await sequelize.query(`select DATEDIFF(DATE_ADD(start, INTERVAL delta MONTH), now()) as expiration from users where password = '${ssh224(username,password)}'`, {
    type: QueryTypes.SELECT,
    raw: true,
  })
}
