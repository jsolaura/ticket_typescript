import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {userType} from "../types/authType";

interface stateType {
    isLoggedIn: boolean;
    user: userType;
    userPhoneNumber: string;
    token: string;
    authType: string;
    successVerification: boolean;
    verificationCode: boolean;
    loginRootFrom: string;
}
const initialState: stateType = {
    isLoggedIn: false,
    user: {
        authType: "",
        cellPhoneVerified: "",
        id: 0,
        name: "",
        platform: "",
        cellphone: "",
        thirdPartyAccessToken: "",
        thirdPartyUserId: "",
        token: "",
        email: "",
        emailVerified: null
    },
    userPhoneNumber: '',
    token: '',
    authType: '',
    successVerification: false,
    verificationCode: false,
    loginRootFrom: '',
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<userType>) {
            state.user = action.payload
            if (state.user) {
                state.isLoggedIn = true;
            } else state.isLoggedIn = false;
        },
        setLogout(state) {
            state.isLoggedIn = false;
            state.user = initialState.user;
        },
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload
        },
        setAuthType(state, action: PayloadAction<string>) {
            state.authType = action.payload;
        },
        setSuccessVerification(state, action: PayloadAction<boolean>) {
            state.successVerification = action.payload;
        },
        setVerificationCode(state, action: PayloadAction<boolean>) {
            state.verificationCode = action.payload;
        },
        setLoginRootFrom(state, action: PayloadAction<string>) {
            state.loginRootFrom = action.payload;
        },
        setUserPhoneNumber(state, action: PayloadAction<string>) {
            state.userPhoneNumber = action.payload;
        },
        reset(state) {
            Object.assign(state, initialState);
        },
    }
})
export const authAction = authSlice.actions;
export default authSlice;