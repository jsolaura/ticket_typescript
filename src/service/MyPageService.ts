import React from "react";
import http from "config/Http-common";
import AlertBasic from "components/display/AlertBasic";
import store from "reducers/store";
import { authAction } from "reducers/auth";
import { ticketAction } from "reducers/ticket";
import { setUserData } from "./AuthService";
import { setUserOnly } from "utils/useSetUserObj";
import { setUserToken } from "utils/useSetUserToken";
import { passwordChangeType, passwordInputType } from "../types/myPageType";

const userInfo = () => {
    setUserToken();
    return http.get('/users/me');
}
const userName = (name: string) => {
    setUserToken();
    return http.put(`/users/me?name=${name}&countryIsoCode=KR&deviceToken`);
}
const userOrderTicketList = () => {
    setUserToken();
    return http.get(`/api/v1/order/ticket/all?pageNumber=0&pageSize=100`);
}
const currentPassword = (encodePw: string) => {
    setUserToken();
    return http.get(`/users/me/oldPassword?oldPassword=${encodePw}`);
}
const newPassword = (encodePw: string) => {
    setUserToken();
    return http.put(`/users/me/passwords?newPassword=${encodePw}`);
}

export const getUserInfo = (setCookieUser: any) => {
    userInfo()
        .then(response => {
            console.log(response)
            setUserOnly(response, setCookieUser);
            store.dispatch(authAction.setUser(setUserData(response)));
            store.dispatch(authAction.setUserPhoneNumber(response.data.data.cellphone));
        })
        .catch(err => console.log(err));
}

export const changeUserName = (name: string, setCookieUser: any) => {
    userName(name)
        .then(response => {
            AlertBasic('변경 사항이 저장되었습니다.', () => {
                console.log(response);
                setUserOnly(response, setCookieUser);
                store.dispatch(authAction.setUser(setUserData(response)));
                window.location.reload();
            });
        })
        .catch(err => console.log(err));
}

export const setUpPassword = (
    setInput: React.Dispatch<React.SetStateAction<passwordInputType>>,
    setNextStep: React.Dispatch<React.SetStateAction<any>>,
    setCurrentPasswordType: React.Dispatch<React.SetStateAction<passwordChangeType>>,
    setNewPasswordType: React.Dispatch<React.SetStateAction<passwordChangeType>>,
    setCheckPasswordType: React.Dispatch<React.SetStateAction<passwordChangeType>>,
) => {
    setInput({
        currentPassword: "",
        newPassword: "",
        checkPassword: "",
    });
    setNextStep(null);
    setCurrentPasswordType({type: 'password', visible: false})
    setNewPasswordType({type: 'password', visible: false})
    setCheckPasswordType({type: 'password', visible: false})
}

export const getCurrentPassword = (
    encodePw: string,
    setNextStep: React.Dispatch<React.SetStateAction<any>>,
    input: passwordInputType,
    setInput: React.Dispatch<React.SetStateAction<passwordInputType>>,
    fn: () => void | any
) => {
    currentPassword(encodePw)
        .then(response => {
            if (response.data.responseCode === 'FAIL') {
                setNextStep(false);
                fn()
            } else setNextStep(true);
        })
        .catch(err => console.log(err));
}

export const changeNewPassword = (
    encodePw: string,
    setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>,
    setNextStep: React.Dispatch<React.SetStateAction<any>>,
    fn: () => void | any
) => {
    newPassword(encodePw)
        .then(response => {
            if (response.data.responseCode === 'SUCCESS') {
                setOpenPopup(false);
                setNextStep(null);
                AlertBasic('비밀번호 변경이 완료되었습니다.', () => {
                    fn()
                }, false, true);
            }
        })
        .catch(err => console.log(err));
}

export const getUserOrderTicketList = () => {
    userOrderTicketList()
        .then(response => {
            console.log(response.data.data);
            store.dispatch(ticketAction.setOrderList(response.data.data))
            store.dispatch(ticketAction.setOrderListCount(response.data.totalCount));
        })
        .catch(err => console.log(err));
}

