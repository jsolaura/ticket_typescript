import React from "react";
import http from 'config/Http-common';
import AlertBasic from "components/display/AlertBasic";
import AlertTwoButton from "components/display/AlertTwoButton";
import store from "../reducers/store";
import { authAction } from "reducers/auth";
import { commonAction } from "reducers/common";
import { resetTimer } from "utils/useControlTimer";
import { setUserToken } from "utils/useSetUserToken";
import { setUserObj } from "utils/useSetUserObj";
import { removeCookie } from "config/cookie";
import { findPasswordUrl, loginUrl, mainUrl } from "config/urlConfig";
import { emailData, emailInput, registerData, signInData } from "../types/authType";

const emailLogin = (data: any) => {
    return http.post('/web/authentication', data);
}
const SNSLogin = (code: string, authType: string) => {
    let data = {
        "authType" : authType,
        "authCode" : code,
    }
    return http.post('/web/authentication', data);
}
const signIn = (data: any) => {
    return http.post('/users', data);
}
const emailVerificationCode = (email: string) => {
    return http.post(`/web/request-email-for-auth?email=${email}`);
}
const emailKeyVerificationCode = (email:string, authKey: string) => {
    return http.post(`/web/email-auth?auth-key=${authKey}&email=${email}`);
}
const findPassword = (email: string) => {
    return http.post(`/users/request-email-for-resetting-password?email=${email}`);
}
const deleteUser = () => {
    setUserToken();
    return http.delete(`/users/me`);
}
const successLogin = (response: any) => {
    http.defaults.headers.common['X-QPK-AUTH-TOKEN'] = response.data.data.token;
    store.dispatch(authAction.setUser(setUserData(response)));
    store.dispatch(authAction.setToken(response.data.data.token));
    if (response.data.data.cellphone) {
        store.dispatch(authAction.setUserPhoneNumber(response.data.data.cellphone));
    }
}
export const resetUserData = (history: any) => {
    store.dispatch(authAction.setLogout());
    delete http.defaults.headers.common['X-QPK-AUTH-TOKEN'];
    removeCookie('user');
    removeCookie('token');
    history.push(mainUrl);
}
export const setUserData = (response: any) => {
    return {
        "id": response?.data.data.id,
        "email": response?.data.data.email,
        "emailVerified": response?.data.data.emailVerified,
        "name": response?.data.data.name,
        "platform": response?.data.data.platform,
        "cellphone": response?.data.data.cellphone,
        "cellPhoneVerified": response?.data.data.cellPhoneVerified,
        "authType": response?.data.data.authType,
        "token": response?.data.data.token,
        "thirdPartyAccessToken": response?.data.data.thirdPartyAccessToken,
        "thirdPartyRefreshToken": response?.data.data.thirdPartyRefreshToken,
        "thirdPartyUserId": response?.data.data.thirdPartyUserId,
    };
}

interface LoginServiceEmailParams {
    data: emailData;
    history: any;
    setFocusFw: any;
    loginRootFrom: string;
    input: emailInput;
    setInput: React.Dispatch<React.SetStateAction<emailInput>>;
    isPc: any;
    setCookieUser: any;
    setCookieToken: any;
}

export const loginServiceEmail = (
    {data, history, setFocusFw, loginRootFrom, input, setInput, isPc, setCookieUser, setCookieToken}: LoginServiceEmailParams
) => {
    store.dispatch(commonAction.setLoading(true));
    emailLogin(data)
        .then(response => {
            if (response !== undefined) {
                setUserObj(response, setCookieUser, setCookieToken);
                successLogin(response)
                store.dispatch(commonAction.setLoading(false));
                if (isPc) {
                    history.goBack();
                } else history.push(mainUrl);
            }
        })
        .catch(err => {
            console.log(err);
            let errCode = err.response.data.responseCode;
            store.dispatch(commonAction.setLoading(false));
            if (errCode === "400") {
                AlertBasic('????????? ?????? ??????????????? ??????????????????.', null);
            } else if (errCode === "403" || err.response.status === 403) {
                AlertTwoButton('??????????????? ???????????? ????????????. \n ???????????? ????????? ??????????????????.', '???????????? ??????', findPasswordUrl, history)
                setInput({ ...input, password: "" })
                setFocusFw(true);
            } else if (errCode === "404" || err.response.status === 404) {
                AlertTwoButton('????????? ????????? ?????? ????????? ???????????????. \n ??????????????? ??????????????????.', '????????????', '/register', history)
                setInput({ ...input, emailLogin: "", password: "" })
            }
        });
}

export const loginServiceSNS = (code: string, authType: string, history: History | any, setCookieUser: any, setCookieToken: any) => {
    SNSLogin(code, authType)
        .then(response => {
            setUserObj(response, setCookieUser, setCookieToken);
            localStorage.removeItem('authType');
            successLogin(response)
            store.dispatch(commonAction.setLoading(false));
            history.push(mainUrl);
        })
        .catch(err => {
            if (err.response.data.responseCode === '400' || err.response.status === 401) {
                AlertBasic('???????????? ???????????????. \n ???????????? ?????? ????????????.', () => {
                    localStorage.removeItem('authType');
                    store.dispatch(commonAction.setLoading(false));
                    history.push(loginUrl);
                })
            }
        })
}

export const findPasswordService = (email: string, history: any) => {
    store.dispatch(commonAction.setLoading(true));
    findPassword(email)
        .then(response => {
            if (response.data.responseCode === "FAIL") {
                store.dispatch(commonAction.setLoading(false));
                AlertTwoButton('?????? ????????? ?????? ???????????????. \n ??????????????? ??????????????????.', '????????????', '/register', history, () => {
                    store.dispatch(commonAction.setLoading(false));
                })
            } else {
                AlertBasic('???????????? ????????? ????????? \n ?????? ??????????????? ?????????????????????.', () => {
                    history.push(loginUrl);
                    store.dispatch(commonAction.setLoading(false));
                }, false, true);
            }
        })
        .catch(err => {
            if (err.response.data.responseCode === "500") {
                AlertBasic('?????? ????????? ???????????? \n ????????? ???????????? ???????????????.', () => {
                    store.dispatch(commonAction.setLoading(false));
                });
            }
        });
}

export const postEmailVerifService = (email: string, history: History | any, isMobile: any, verificationCode: boolean, timerActive: boolean) => {
    emailVerificationCode(email)
        .then(response => {
            if (response.data.responseCode === "FAIL") {
                if (response.data.message.includes('??????')) {
                    AlertBasic(response.data.message);
                } else{
                    AlertTwoButton(response.data.message, '?????????', loginUrl, history);
                }
            } else {
                if (!verificationCode && !timerActive) {
                    AlertBasic(`??????????????? ?????????????????????. \n ?????? ???????????? 1-2?????? ???????????????. \n ????????? ?????? ????????????, ${isMobile ? `\n` : ""}???????????? ??????????????????.`, () => {
                        store.dispatch(commonAction.setTimerActive(true));
                        store.dispatch(authAction.setVerificationCode(true));
                        store.dispatch(authAction.setSuccessVerification(false));
                    });
                } else {
                    AlertBasic(`????????? ????????????????????????. \n ?????? ????????? ?????? ??????, ${isMobile ? `\n` : ""}???????????? ??????????????????.`, () => {
                        resetTimer();
                        store.dispatch(commonAction.setTimerActive(true));
                        store.dispatch(authAction.setVerificationCode(true));
                        store.dispatch(authAction.setSuccessVerification(false));
                    });
                }
            }
        })
        .catch(err => console.log(err));
}

export const checkEmailVerifService = (email: string, authKey: string, input: registerData, setInput: React.Dispatch<React.SetStateAction<{registerData}>> | any) => {
    store.dispatch(commonAction.setTimerActive(false));
    emailKeyVerificationCode(email, authKey)
        .then(response => {
            if (response.data.responseCode === "FAIL") {
                AlertBasic(response.data.message, () => {
                    setInput({ ...input, verificationCode: "" });
                    store.dispatch(authAction.setVerificationCode(true));
                });
            } else {
                store.dispatch(authAction.setVerificationCode(true));
                store.dispatch(authAction.setSuccessVerification(true));
            }
        })
        .catch(err => {
            console.log(err)
        });
}

export const signInService = (data: signInData, history: History | any, setCookieUser: any, setCookieToken: any) => {
    signIn(data)
        .then(response => {
            AlertBasic("??????????????? ?????????????????????.", () => {
                setUserObj(response, setCookieUser, setCookieToken);
                store.dispatch(authAction.setVerificationCode(false));
                store.dispatch(authAction.setSuccessVerification(false));
                successLogin(response);
                history.push(mainUrl);
            }, false, true);
        })
        .catch(err => {
            console.log(err);
        })
}

export const logoutService = (history: any) => {
    console.log("!?")
    store.dispatch(commonAction.setLoading(true));
    AlertTwoButton('???????????? ???????????????????', '????????????', null, null, () => {
        resetUserData(history);
        store.dispatch(commonAction.setLoading(false));
    }, '??????');
    store.dispatch(commonAction.setLoading(false));
}

export const deleteUserService = (history: any) => {
    AlertTwoButton(`????????? ??????????????? \n?????? ???????????? ??? ?????? ?????? ????????? ???????????????. \n????????? ?????????????????????????`, '????????????', null, null, () => {
        store.dispatch(commonAction.setLoading(true));
        deleteUser()
            .then(response => {
                store.dispatch(commonAction.setLoading(false));
                if (response.data.responseCode !== 'SUCCESS') {
                    AlertBasic(response.data.message);
                } else {
                    resetUserData(history);
                }
            })
            .catch(err => {
                if (err.response.data.responseCode === "500") {
                    AlertBasic('?????? ????????? ???????????? \n ????????? ???????????? ???????????????.', () => {
                        store.dispatch(commonAction.setLoading(false));
                    });
                }
                console.log(err)
            });
    }, '??????');
}
