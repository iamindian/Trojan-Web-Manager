import { User } from "../dao/index.js";
export async function getUsers() {
  const users = await User.findAll();
  return users;
}
export async function addUser(username, password) {
  await User.create({ username, password });
}
