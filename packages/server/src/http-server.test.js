//https://stackoverflow.com/questions/46227783/encoding-not-recognized-in-jest-js
// import iconv from 'iconv-lite';
// import encodings from 'iconv-lite/encodings';
// iconv.encodings = encodings;
import dotenv from "dotenv";
import supertest from 'supertest';
import moment from 'moment';
import { start, sequelize, nodeCache } from './http-server.js';
import { ssh224 } from "./utils/index.js";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, './.env') });
describe('test server', function () {
    let request, server, token;
    beforeAll(async () => {
        server = await start();
        request = supertest(server);
        dotenv.config({ path: ".env" })
    })
    afterAll(async () => {
        await sequelize.close()
        await server.close()
    })
    it("test add an user", async () => {
        await sequelize.models.User.truncate();
        const username = "test", password = "test"
        const admin = "admin", adminpass = "123456"
        let response = await request.get('/signin').query({ username: admin, password: adminpass });
        const { header } = response;
        response = await request.put('/adduser').set("Cookie", [...header['set-cookie']]).send({
            username, password: ssh224(username, password)
        })
        expect(response.status).toBe(200);
    })
    it("test signin", async () => {
        const username = "admin", password = "123456"
        const response = await request.get('/signin').query({
            username, password
        })
        expect(response.status).toBe(200);
        expect(response.headers['set-cookie'].find((e) => {
            return /^access_token.+/.test(e)
        })).toBeDefined();
    })
    it("test signin fail", async () => {
        const username = "xxx", password = "xxx"
        const response = await request.get('/signin').query({
            username, password
        })
        expect(response.status).toBe(401);
        if (response.headers['set-cookie']) {
            expect(response.headers['set-cookie'].find((e) => {
                return /^access_token.+/.test(e)
            })).toBeUndefined();
        }

    })
    it("test get users with right token", async () => {
        let response
        try {
            await sequelize.models.User.truncate();
            for (let i = 0; i < 5; i++) {
                await sequelize.models.User.create({username: "t" + i, password: ssh224("t" + i, "p" + i)});
            }
            const admin = "admin", adminpass = "123456"
            response = await request.get('/signin').query({ username: admin, password: adminpass });
            const { header } = response;
            response = await request.get('/users').query({ offset: 0, limit: 5 }).set("Cookie", [...header['set-cookie']])

        } catch (e) {
            console.error(e);
        }
        expect(response.status).toBe(200);
        expect(response.body.users.length).toBe(5)

    })
    it("test get users with wrong token", async () => {
        const response = await request.get('/users').set("Cookie", ["access_token=xxx"])
        expect(response.status).toBe(401);
    })
    it("test get users without token", async () => {
        const response = await request.get('/users')
        expect(response.status).toBe(401);
    })
    it("test extend when expiration is validated", async () => {
        const username = 'test'
        const password = 'test'
        const start = moment().subtract(5, 'month');
        const delta = 8;
        const quantity = 4;
        try {
            await sequelize.models.User.truncate();
            await sequelize.models.User.create({
                id: 1,
                username,
                password: ssh224(username, password),
                start,
                delta,
                quota: 0,
                download: 0,
                upload: 0
            });

        } catch (e) {
            console.log(e)
        }
        const admin = "admin", adminpass = "123456"
        let response = await request.get('/signin').query({ username: admin, password: adminpass });
        const { header } = response;
        response = await request.get('/extend').set("Cookie", [...header['set-cookie']]).query({
            username,
            password,
            quantity
        })
        expect(response.status).toBe(200);
        expect(response.body.delta).toBe('12');

    })
    it("test extend when expiration is not validated", async () => {
        const username = 'test'
        const password = 'test'
        const start = moment().subtract(5, 'month');
        const delta = 3;
        const quantity = 4;
        try {
            await sequelize.models.User.truncate();
            await sequelize.models.User.create({
                id: 1,
                username,
                password: ssh224(username, password),
                start,
                delta,
                quota: 0,
                download: 0,
                upload: 0
            });

        } catch (e) {
            console.log(e)
        }
        const admin = "admin", adminpass = "123456"
        let response = await request.get('/signin').query({ username: admin, password: adminpass });
        const { header } = response;
        response = await request.get('/extend').set("Cookie", [...header['set-cookie']]).query({
            username,
            password,
            quantity
        })
        expect(response.status).toBe(200);
        expect(response.body.delta).toBe('4');

    })
    it("test extend with mvcc", async () => {
        const username = 'test'
        const password = 'test'
        const start = moment().subtract(5, 'month');
        const delta = 3;
        const quantity = 4;
        try {
            await sequelize.models.User.truncate();
            await sequelize.models.User.create({
                id: 1,
                username,
                password: ssh224(username, password),
                start,
                delta,
                quota: 0,
                download: 0,
                upload: 0
            });

        } catch (e) {
            console.log(e)
        }
        const admin = "admin", adminpass = "123456"
        let response = await request.get('/signin').query({ username: admin, password: adminpass });
        const { header } = response;
        response = await request.get('/extend').set("Cookie", [...header['set-cookie']]).query({
            username,
            password,
            quantity
        })

        response = await request.get('/extend').set("Cookie", [...header['set-cookie']]).query({
            username,
            password,
            quantity
        })
        response = await request.get('/extend').set("Cookie", [...header['set-cookie']]).query({
            username,
            password,
            quantity
        })
        expect(response.status).toBe(200);
        expect(response.body.delta).toBe('12');

    })

}); 