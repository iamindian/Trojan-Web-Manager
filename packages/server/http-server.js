import Koa from "koa";
import Router from "koa-router";
import userService from "./service/index.js";
import bodyParser from 'koa-body-parser';
// import https from "https";
const app = new Koa();
const router = new Router();
const HOST = "localhost";
const HTTP_PORT = 8080;
// const HTTPS_PORT = 443;
router.get("/users",async (ctx, next) => {
  ctx.body = await userService.getUsers(ctx.params.username, ctx.params.password);
}).get("/expiration", async (ctx, next) => {
  ctx.body = await userService.getUserExpiration(ctx.request.query.username, ctx.request.query.password);
}).put("/adduser", async (ctx, next) => {
  try{
    console.log(ctx.request.body);
    const user = JSON.parse(ctx.request.body);
    await userService.addUser(user.username, user.password);
    ctx.body = "done"
  }catch(e){
    console.error(e);
    ctx.body = "fail"
  }
});
app.use(bodyParser());
app.use(router.routes());
app.listen(8080,()=>{
  console.log('Server running on https://localhost:8080');
});
