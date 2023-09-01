import Koa from "koa";
import Router from "koa-router";
import { getUsers, addUser, getUserExpiration, init as initService } from "./service/index.js";
import bodyParser from 'koa-body-parser';
import { Sequelize } from "sequelize";
import { init as initModels } from "./models/index.js"
// import https from "https";
const sequelize = new Sequelize("trojan", "root", "Ilove1225!", {
  dialect: "mysql",
  pool: {
    max: 5,
    idle: 30000,
    acquire: 60000,
  },
});
await initModels(sequelize);
await initService(sequelize);
const app = new Koa();
const router = new Router();
const HOST = "localhost";
const HTTP_PORT = 8080;
// const HTTPS_PORT = 443;
router.get("/users", async (ctx, next) => {
  ctx.body = await getUsers(ctx.params.username, ctx.params.password);
}).get("/expiration", async (ctx, next) => {
  ctx.body = await getUserExpiration(ctx.request.query.username, ctx.request.query.password);
}).put("/adduser", async (ctx, next) => {
  try {
    const user = JSON.parse(ctx.request.body);
    ctx.body = await addUser(user.username, user.password);
  } catch (e) {
    console.error(e);
  }
});
app.use(bodyParser());
app.use(router.routes());
app.listen(8080, () => {
  console.log('Server running on https://localhost:8080');
});
