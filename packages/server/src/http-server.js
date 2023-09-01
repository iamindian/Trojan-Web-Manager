import dotenv from "dotenv"
import path from "path"
import Koa from "koa";
import Router from "koa-router";
import bodyParser from 'koa-body-parser';
import { Sequelize } from "sequelize";
import { getUsers, getUserExpiration, addUser, init as userService, extendExpiration, extendExpirationById } from "./service/userService.js";
import { v4 as uuidv4 } from 'uuid';
import NodeCache from 'node-cache';
// import https from "https";
import { init as userModel } from "./models/User.model.js";
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
console.info('admin:' + process.env.ADMIN);
console.info('admin_password:' +process.env.ADMIN_PASSWORD)
console.info('database:' +process.env.DATABASE)
const nodeCache = new NodeCache({ stdTTL: 120, checkperiod: 120 });
nodeCache.on('set', (key, value) => {
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
function setToken(ctx) {
  const newToken = uuidv4();
  nodeCache.set(newToken, Date.now());
  ctx.cookies.set('access_token', newToken, { httpOnly: true, secure: false, sameSite: "none", secureProxy: true });
  ctx.status = 200;
}
async function start() {
  await userModel(sequelize);
  await userService(sequelize);
  app.use(bodyParser());
  router.use(["/users", "/extend", "/adduser"], userAuth())
  router
    .get("/signin", async (ctx, next) => {
      const username = ctx.request.query.username;
      const password = ctx.request.query.password;
      try {
        /**
         * update token
         */
        const accessToken = ctx.cookies.get('access_token')
        if (accessToken && nodeCache.has(accessToken)) {
          setToken(ctx)
          return
        }
        /**
         * check username and password
         */
        if (username && password && username === process.env.ADMIN && password === process.env.ADMIN_PASSWORD) {
          setToken(ctx)
          return
        }
        ctx.status = 401;

      } catch (e) {
        console.error(e);
        ctx.body = {}
      }
    })
    .get("/users", async (ctx, next) => {
      const offset = parseInt(ctx.request.query.offset);
      const limit = parseInt(ctx.request.query.limit);
      const id = ctx.request.query.id;
      if(Number.isNaN(offset) || Number.isNaN(limit)){
        return;
      }
      // const username = ctx.request.query.username;
      let where = {}
      if (id && !Number.isNaN(id)) {
        where = Object.assign({}, where, { id })
      }
      // if (username) {
      //   where = Object.assign({}, where, { username })
      // }
      ctx.body = await getUsers(offset, limit, where);
    })
    .get("/expiration", async (ctx, next) => {
      try {
        ctx.body = await getUserExpiration(ctx.request.query.username, ctx.request.query.password);
      } catch (e) {
        console.error(e);
        ctx.body = []
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
        ctx.body = [{ expiration: 0 }]
      }

    })
    .get("/extendById", async (ctx, next) => {
      const id = ctx.request.query.id;
      const quantity = ctx.request.query.quantity;
      try {
        const user = await extendExpirationById(id, quantity)
        ctx.body = user;
      } catch (e) {
        throw e;
        ctx.body = [{ expiration: 0 }]
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



