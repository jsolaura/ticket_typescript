import http from "config/Http-common";
import { getCookie } from "config/cookie";

export const setUserToken = () => {
    const token = getCookie('token');
    if (token) {
        return http.defaults.headers.common['X-QPK-AUTH-TOKEN'] = token;
    }
}