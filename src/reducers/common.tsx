import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { noticeDataType, termsType } from "../types/commonType";

interface stateType {
    count: number;
    scrollY: number;
    showLang: false;
    currentLang: string;
    policy: boolean;
    loading: boolean;
    loadingCustom: boolean;
    loadingText: string;
    privacyPolicy: termsType | null;
    termsOfService: termsType | null;
    noticeList: Array<noticeDataType> | null;
    noticeTotalCount: number;
    page: number;
    limit: number;
    timerCount: number;
    timerActive: boolean;
    prevPath: string;
    currentPath: string;
}
const initialState: stateType = {
    count: 0,
    scrollY: 0,
    showLang: false,
    currentLang: 'KOR',
    policy: false,
    loading: false,
    loadingCustom: false,
    loadingText: '',
    privacyPolicy: null,
    termsOfService: null,
    noticeList: [],
    noticeTotalCount: 0,
    page: 1,
    limit: 10,
    timerCount: 179,
    timerActive: false,
    prevPath: '',
    currentPath: '',
}

const commonSlice = createSlice({
    name: 'common',
    initialState,
    reducers: {
        setScrollY(state, action) {
            state.scrollY = action.payload
        },
        setScroll0(state) {
            state.scrollY = 0
        },
        setCurrentLang(state, action) {
            state.currentLang = action.payload
        },
        openPolicyWindow(state) {
            state.policy = true;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setLoadingCustom(state, action: PayloadAction<boolean>) {
            state.loadingCustom = action.payload;
        },
        setLoadingText(state, action: PayloadAction<string>) {
            state.loadingText = action.payload;
        },
        setPrivacyPolicy(state, action: PayloadAction<termsType>) {
            state.privacyPolicy = action.payload;
        },
        setTermsOfService(state, action: PayloadAction<termsType>) {
            state.termsOfService = action.payload;
        },
        setNoticeList(state, action: PayloadAction<Array<noticeDataType>>) {
            state.noticeList = action.payload;
        },
        setNoticeTotalCount(state, action: PayloadAction<number>) {
            state.noticeTotalCount = action.payload;
        },
        setTimerCount(state, action: PayloadAction<number>) {
            state.timerCount = action.payload;
        },
        setTimerActive(state, action: PayloadAction<boolean>) {
            state.timerActive = action.payload;
        },
        setPrevPath(state, action: PayloadAction<string>) {
            state.prevPath = action.payload;
        },
        setCurrentPath(state, action: PayloadAction<string>) {
            state.currentPath = action.payload;
        },
        resetTimer(state) {
            state.timerCount = 180;
            state.timerActive = false;
        },
        setPage(state, action: PayloadAction<number>) {
            state.page = action.payload;
        },
    }
})
export const commonAction = commonSlice.actions;
export default commonSlice;