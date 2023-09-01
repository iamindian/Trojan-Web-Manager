import { getUsers, addUser, getUserExpiration, init as userInit } from "./userService.js";
async function init(sequelize){
    await userInit(sequelize);
}
export {
    getUsers, addUser, getUserExpiration, init
}