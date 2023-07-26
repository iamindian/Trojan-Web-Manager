//https://stackoverflow.com/questions/46227783/encoding-not-recognized-in-jest-js
import iconv from 'iconv-lite';
import encodings from 'iconv-lite/encodings';
iconv.encodings = encodings;

import supertest from 'supertest';
import { start, sequelize } from './http-server.js';
import { ssh224 } from "./utils/index.js";

describe('test server', function () {
    let request, server;
    beforeAll( async() => {
        server = await start();
        request = supertest(server);
    })
    afterAll(async () =>{ 
        sequelize.close()
        server.close()
    })
    it("test add an user", async () => {
        const username = "admin", password = "123456"
        const response = await request.put('/adduser').send({
            username, password: ssh224(username, password)
        })
        expect(response.status).toBe(200);
    })
}); 