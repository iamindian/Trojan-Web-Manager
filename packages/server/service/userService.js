
import { ssh224 } from "../utils/index.js";
import { QueryTypes } from "sequelize"
import BigNumber from "bignumber.js"
import moment from "moment";
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
  return await sequelize.query(`select DATEDIFF(DATE_ADD(start, INTERVAL delta MONTH), now()) as expiration from users where password = '${ssh224(username, password)}'`, {
    type: QueryTypes.SELECT,
    raw: true,
  })
}
export async function extendExpiration(username, password, quantity) {
  try {
    const result = await sequelize.transaction(async (t) => {
      const user = await sequelize.models.User.findOne({
        where: {
          username, password: ssh224(username, password)
        }
      })
      if (!user)
        return {};
      if (moment(user.start).add(user.delta, 'month') >= moment()) {
        user.delta = new BigNumber(user.delta).plus(quantity);
        user.save()
      } else {
        user.delta = quantity;
        user.start = moment();
        user.save();
      }
      return user;
    })
    return result;
  } catch (e) {
    console.error(e)
  }
}
