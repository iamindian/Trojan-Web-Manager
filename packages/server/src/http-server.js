import dotenv from "dotenv"
import path from "path"
import Koa from "koa";
import Router from "koa-router";
import bodyParser from 'koa-body-parser';
import { Sequelize } from "sequelize";
import { getUsers, getUserExpiration, addUser, init as userService, extendExpiration } from "./service/userService.js";
import { v4 as uuidv4 } from 'uuid';
import NodeCache from 'node-cache';
// import https from "https";
import { init as userModel } from "./models/User.model.js";
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const nodeCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });
nodeCache.on('set',(key, value)=>{
  console.log(`node cache set ${key}->${value}`)
})
const database = process.env.DATABASE;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const sequelize = new Sequelize(database, username, password, {
  dialect: "mysql",
  pool: {
    max: 5,
    idle: 30000,
    acquire: 60000,
    evict: 0
  },
  logging: false,
});
const app = new Koa();
const router = new Router();
const HOST = process.env.HOST;
const HTTP_PORT = process.env.PORT;
// const HTTPS_PORT = 443;
const userAuth = function () {
  return async function (ctx, next) {
    let token = ctx.cookies.get("access_token");
    if (!token) {
      ctx.throw('Access denied. Please login!', 401);
      return
    }
    if (!nodeCache.get(token)) {
      ctx.throw('Access denied. Please login!', 401);
      return
    }
    await next();
  }
}
async function start() {
  await userModel(sequelize);
  await userService(sequelize);
  app.use(bodyParser());
  router.use(["/users","/extend", "/adduser"], userAuth())
  router
    .get("/signin", async (ctx, next) => {
      const username = ctx.request.query.username;
      const password = ctx.request.query.password;
      try {
        /**
         * check username and password
         */
        if (username && password && username === process.env.ADMIN && password === process.env.ADMIN_PASSWORD) {
          //generate token and save in cache
          const token = uuidv4()
          nodeCache.set(token, Date.now())
          ctx.cookies.set('access_token', token, { httpOnly: true, secure: false, sameSite: "none", secureProxy: true });
          ctx.status = 200;
        } else {
          ctx.status = 401;
        }
      } catch (e) {
        console.error(e);
        ctx.body = {}
      }
    })
    .get("/users", async (ctx, next) => {
      ctx.body = await getUsers();
    })
    .get("/expiration", async (ctx, next) => {
      try {
        ctx.body = await getUserExpiration(ctx.request.query.username, ctx.request.query.password);
      } catch (e) {
        console.error(e);
        ctx.body = {}
      }
    })
    .get("/extend", async (ctx, next) => {
      const username = ctx.request.query.username;
      const password = ctx.request.query.password;
      const quantity = ctx.request.query.quantity;
      try {
        const user = await extendExpiration(username, password, quantity)
        ctx.body = user;
      } catch (e) {
        ctx.body = {}
      }

    })
    .put("/adduser", async (ctx, next) => {
      try {
        const user = ctx.request.body;
        ctx.body = await addUser(user.username, user.password);
      } catch (e) {
        ctx.body = {}
      }
    });
  app.use(router.routes());
  const server = await app.listen(parseInt(process.env.PORT), () => {
    console.log(`Server running on http://${process.env.HOST}:${process.env.PORT}`);
  });
  return server;
}
export { sequelize, start, nodeCache }



