import {signin as login} from "./api/userService";
export default {
    async signin(username, password) {
        const response = await login(username, password) 
        if(response.status===200){
            sessionStorage.setItem("isAuthenticated", 'true');
            this.username = username;
        }
    },
    async signout() {
        // request server to clear cookie and change isAuthenticated to false;
        sessionStorage.setItem('isAuthenticated', 'false');
    },
}