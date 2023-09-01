import {signin as login} from "./api/userService";
export default {
    isAuthenticated: false,
    username: null,
    async signin(username, password) {
        const response = await login(username, password) 
        if(response.status===200){
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