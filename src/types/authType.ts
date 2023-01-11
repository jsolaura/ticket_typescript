import React from "react";

export type userType = {
    authType: string,
    cellPhoneVerified: string | boolean,
    id: number,
    name: string,
    platform: string,
    cellphone: string,
    thirdPartyAccessToken: string,
    thirdPartyUserId: string,
    token: string,
    email: string,
    emailVerified: boolean | null
}


export type emailData = {
    authType: string; email: string; encodedPassword: any;
}
export type emailInput = {
    emailLogin: string, password: string
}
export type registerData = {
    email: string, emailCheck: string, verificationCode: string, password: string, passwordCheck: string
}
export type signInData = {
    id: number | null,
    username: string | null,
    encodedPassword: string | any,
    email: string,
    platform: string,
    authType: string
}

type registerInputsType = {
    email: string,
    emailCheck: string,
    verificationCode: string,
    password: string,
    passwordCheck: string,
}
type registerPasswordType = {
    type: string,
    visible: boolean,
}
export type registerFormType = {
    input: registerInputsType,
    setInput: React.Dispatch<React.SetStateAction<{email: string, emailCheck: string, verificationCode: string, password: string, passwordCheck: string}>>,
    passwordType: registerPasswordType,
    passwordConfirmType: registerPasswordType,
    setPasswordType: any,
    setPasswordConfirmType: any,
}
export type termsType = {
    setIsReady: any,
    checkedTerms: Array<any>,
    setCheckedTerms: any
}
export type termListType = {
    id: number,
    title: string,
    required?: boolean
}