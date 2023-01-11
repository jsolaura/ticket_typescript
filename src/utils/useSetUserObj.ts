import { setUserData } from "../service/AuthService";

export const setUserObj = (response: any, setCookieUser: any, setCookieToken: any) => {
    setUserOnly(response, setCookieUser);
    setCookieToken('token', response.data.data.token, { path: '/', expires: new Date(Date.now() + 10800000)});
}

export const setUserOnly = (response: any, setCookieUser: any) => {
    setCookieUser('user', JSON.stringify(setUserData(response)), { path: '/', expires: new Date(Date.now() + 10800000)});
}