
import { User } from "./User.model.js";
export async function init(sequelize){
  await User(sequelize);
}
