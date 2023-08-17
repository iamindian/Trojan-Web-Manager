import {signin} from "./api/userService";
export default {
    isAuthenticated: false,
    username: null,
    async signin(username, password) {
        const {response:{status}} = await signin(username, password) 
        if(status===200){
            this.isAuthenticated = true;
            this.username = username;
        }
    },
    async signout() {
        await new Promise((r) => setTimeout(r, 500)); // fake delay
        this.isAuthenticated = false;
        this.username = "";
    },
}