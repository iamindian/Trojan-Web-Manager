import { getUsers, init, addUser } from "./userService.js"
import { ssh224 } from "../utils/index.js";
import SequelizeMock from 'sequelize-mock';
const dbMock = new SequelizeMock();
const username = "admin", password = "123456";
describe("test user service", function () {
    beforeEach(async () => {
        await init(dbMock);
        dbMock.define('User', {
            username,
            password: ssh224(username, password)
        }, {
            instanceMethods: {
                getInfo: function () {
                    return this.get('username') + ' ' + this.get('password');
                },
            },
        });
        dbMock.models.User.create = dbMock.models.User.upsert;
        dbMock.models.User.$queryInterface.$useHandler((query, options)=>{
            console.log(query);
        })
    });
    
    it('test get users', async () => {
        const users = await getUsers();
        expect(users.length).toBe(1);
    });
    it('test add user', async () => {
        const isInsert = await addUser("admin", "password");
        expect(isInsert).toBeTruthy();
    });
});
