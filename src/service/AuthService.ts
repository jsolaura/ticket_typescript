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
                AlertBasic('아이디 혹은 비밀번호를 입력해주세요.', null);
            } else if (errCode === "403" || err.response.status === 403) {
                AlertTwoButton('계정정보가 올바르지 않습니다. \n 비밀번호 찾기를 이용해주세요.', '비밀번호 찾기', findPasswordUrl, history)
                setInput({ ...input, password: "" })
                setFocusFw(true);
            } else if (errCode === "404" || err.response.status === 404) {
                AlertTwoButton('가입한 이력이 없는 이메일 계정입니다. \n 회원가입을 진행해주세요.', '회원가입', '/register', history)
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
                AlertBasic('로그아웃 되었습니다. \n 로그인을 다시 해주세요.', () => {
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
                AlertTwoButton('가입 이력이 없는 계정입니다. \n 회원가입을 진행해주세요.', '회원가입', '/register', history, () => {
                    store.dispatch(commonAction.setLoading(false));
                })
            } else {
                AlertBasic('입력하신 이메일 주소로 \n 임시 비밀번호가 전송되었습니다.', () => {
                    history.push(loginUrl);
                    store.dispatch(commonAction.setLoading(false));
                }, false, true);
            }
        })
        .catch(err => {
            if (err.response.data.responseCode === "500") {
                AlertBasic('서버 오류가 발생하여 \n 요청을 처리하지 못했습니다.', () => {
                    store.dispatch(commonAction.setLoading(false));
                });
            }
        });
}

export const postEmailVerifService = (email: string, history: History | any, isMobile: any, verificationCode: boolean, timerActive: boolean) => {
    emailVerificationCode(email)
        .then(response => {
            if (response.data.responseCode === "FAIL") {
                if (response.data.message.includes('애플')) {
                    AlertBasic(response.data.message);
                } else{
                    AlertTwoButton(response.data.message, '로그인', loginUrl, history);
                }
            } else {
                if (!verificationCode && !timerActive) {
                    AlertBasic(`인증코드가 전송되었습니다. \n 코드 수신까지 1-2분이 소요됩니다. \n 메일이 오지 않았다면, ${isMobile ? `\n` : ""}스팸함을 확인해주세요.`, () => {
                        store.dispatch(commonAction.setTimerActive(true));
                        store.dispatch(authAction.setVerificationCode(true));
                        store.dispatch(authAction.setSuccessVerification(false));
                    });
                } else {
                    AlertBasic(`코드가 재전송되었습니다. \n 코드 수신이 안된 경우, ${isMobile ? `\n` : ""}스팸함을 확인해주세요.`, () => {
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
            AlertBasic("회원가입이 완료되었습니다.", () => {
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
    AlertTwoButton('로그아웃 하시겠습니까?', '로그아웃', null, null, () => {
        resetUserData(history);
        store.dispatch(commonAction.setLoading(false));
    }, '취소');
    store.dispatch(commonAction.setLoading(false));
}

export const deleteUserService = (history: any) => {
    AlertTwoButton(`회원을 탈퇴하시면 \n기존 구매내역 등 모든 이용 정보는 사라집니다. \n그래도 탈퇴하시겠습니까?`, '회원탈퇴', null, null, () => {
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
                    AlertBasic('서버 오류가 발생하여 \n 요청을 처리하지 못했습니다.', () => {
                        store.dispatch(commonAction.setLoading(false));
                    });
                }
                console.log(err)
            });
    }, '취소');
}
