import React from "react";
import AlertBasic from "components/display/AlertBasic";
import http from "config/Http-common";
import store from "reducers/store";
import { commonAction} from "reducers/common";
import { ticketAction } from "reducers/ticket";
import { authAction } from "reducers/auth";
import { resetTimer } from "utils/useControlTimer";
import { setUserToken } from "utils/useSetUserToken";
import { phoneNumberInputsType } from "../types/commonType";

const postVerificationCode = (phoneNum: string, name: string) => {
    setUserToken();
    return http.post(`/users/request-cellphone-for-auth?phoneNum=${phoneNum}&name=${name}`)
}
const checkVerificationCode = (authKey: string) => {
    setUserToken();
    return http.post(`/users/cellphone-auth?auth-key=${authKey}`)
}
const requestPostVerificationCode = (phoneNum: string) => {
    setUserToken();
    return http.post(`/web/re-request-cellphone-auth?phoneNum=${phoneNum}`);
}
const requestCheckVerificationCode = (authKey: string) => {
    setUserToken();
    return http.post(`/web/cellphone-re-auth?auth-key=${authKey}`);
}
const resetPhoneNumVerification = (setOpenPopup, setInput, input) => {
    setOpenPopup(false);
    store.dispatch(commonAction.setTimerActive(false));
    resetTimer();
    setInput({...input, phoneNumber: ""})
}
const loadingControl = (loading: boolean) => {
    if (loading) {
        store.dispatch(commonAction.setLoadingCustom(true));
        store.dispatch(commonAction.setLoading(true));
    } else {
        store.dispatch(commonAction.setLoadingCustom(false));
        store.dispatch(commonAction.setLoading(false));
    }
}
const postResponse = (data, setOpenPopup, input, setInput) => {
    if (data.responseCode === 'FAIL') {
        setOpenPopup(false);
        if (data.message === 'auth_003') {
            AlertBasic('인증이 완료된 휴대폰 번호 입니다.', () => {
                resetPhoneNumVerification(setOpenPopup, setInput, input);
            });
        } else if (data.message === 'auth_007'){
            AlertBasic('휴대폰 번호를 확인해주세요.', () => {
                resetPhoneNumVerification(setOpenPopup, setInput, input);
            });
        } else {
            AlertBasic(data.message, () => {
                resetPhoneNumVerification(setOpenPopup, setInput, input);
            });
        }
    } else {
        if (data.data.indexOf('실패') > -1) {
            setOpenPopup(false);
            loadingControl(false);
            AlertBasic('휴대폰 번호를 확인해주세요.', () => {
                resetPhoneNumVerification(setOpenPopup, setInput, input);
            });
            return false;
        }
        resetTimer();
        store.dispatch(commonAction.setTimerActive(true));
        store.dispatch(ticketAction.postVerification(true));
    }
}
const checkResponse = (data, setOpenPopup, input, setInput, phoneNumber) => {
    if (data.responseCode === "FAIL") {
        store.dispatch(commonAction.setTimerActive(false));
        if (data.message === "auth_007") {
            loadingControl(false);
            AlertBasic('올바른 인증번호를 입력해주세요.', () => {
                setOpenPopup(true)
            });
        } else if (data.message === "auth_008") {
            loadingControl(false);
            AlertBasic('이미 인증된 휴대폰 번호입니다. ', () => {
                setOpenPopup(true)
                setInput({
                    name: "",
                    phoneNumber: "",
                    verificationCode: "",
                })
            });
        } else {
            loadingControl(false);
            AlertBasic('휴대폰 번호를 확인해주세요.', () => {
                resetPhoneNumVerification(setOpenPopup, setInput, input);
            });
        }
    } else {
        store.dispatch(commonAction.setTimerActive(false));
        loadingControl(false);
        AlertBasic('인증이 완료되었습니다.', () => {
            store.dispatch(ticketAction.checkVerification(true));
            store.dispatch(authAction.setUserPhoneNumber(phoneNumber));
        }, false, true);
    }
}

export const postVerificationCodeService = (
    phoneNum: string,
    name: string,
    setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>,
    input: phoneNumberInputsType,
    setInput: React.Dispatch<React.SetStateAction<phoneNumberInputsType>>,
    checkedPhoneNum: boolean
) => {
    if (!checkedPhoneNum) {
        postVerificationCode(phoneNum, name)
            .then(response => {
                postResponse(response.data, setOpenPopup, input, setInput);
            })
            .catch(err => console.log(err));
    } else {
        requestPostVerificationCode(phoneNum)
            .then(response => {
                postResponse(response.data, setOpenPopup, input, setInput);
            })
            .catch(err => console.log(err));
    }
}
export const checkVerificationCodeService = (
    authKey: string,
    phoneNumber: string,
    setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>,
    input: phoneNumberInputsType,
    setInput: React.Dispatch<React.SetStateAction<phoneNumberInputsType>>,
    checkedPhoneNum: boolean
) => {
    setOpenPopup(false);
    loadingControl(true);
    store.dispatch(commonAction.setLoadingText('인증'));
    if (!checkedPhoneNum) {
        checkVerificationCode(authKey)
            .then(response => {
                checkResponse(response.data, setOpenPopup, setInput, input, phoneNumber);
            })
            .then(err => console.log(err));
    } else {
        requestCheckVerificationCode(authKey)
            .then(response => {
                checkResponse(response.data, setOpenPopup, setInput, input, phoneNumber);
            })
            .catch(err => console.log(err));
    }
}
