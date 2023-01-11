import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
const instance = axios.create({
    headers: {
        "Content-type": 'application/json',
        "Content-Type": "multipart/form-data",
    }
});
// const token = getCookie('token');
// instance.interceptors.response.use((response) => response,
//     async (error) => {
//         // if (token) {
//         //     const {config, response: {status}} = error;
//         //     if (status === 401 && !config?.sent) {
//         //         resetUserData();
//         //         return Promise.reject(error);
//         //     }
//         //     return Promise.reject(error);
//         // }
//     }
// )
export default instance;