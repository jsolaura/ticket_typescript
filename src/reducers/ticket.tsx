import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {exhibitionType, OptionsType, orderHistoryType, orderListType, ticketType} from "src/types/ticketType";

interface stateType {
    exhibition: exhibitionType | null;
    ticketDetail?: ticketType | null;
    ticketOptionList?: Array<OptionsType> | null;
    normalOption: OptionsType,
    childOption: OptionsType,
    totalPrice: number;
    postVerificationCode: boolean;
    checkVerificationCode: boolean;
    orderHistory?: orderHistoryType | null;
    orderList: Array<orderListType> | any ;
    orderListCount: number;
}

const initialState: stateType = {
    exhibition: null,
    ticketDetail: null,
    ticketOptionList: null,
    normalOption: { title: "성인", subTitle: "(만 19세 이상)", count: 0, price: 0},
    childOption: { title: "소인", subTitle: "(36개월 이상 ~ 만 18세)", count: 0, price: 0},
    totalPrice: 0,
    postVerificationCode: false,
    checkVerificationCode: false,
    orderHistory: null,
    orderList: [],
    orderListCount: 0,
}
const ticketSlice = createSlice({
    name: 'ticket',
    initialState,
    reducers: {
        setExhibition(state, action: PayloadAction<exhibitionType>) {
            state.exhibition = action.payload;
        },
        setTicketDetail(state, action: PayloadAction<ticketType>) {
            state.ticketDetail = action.payload;
        },
        setTicketOptionList(state, action: PayloadAction<Array<OptionsType>>) {
            state.ticketOptionList = action.payload;
        },
        setNormalOptionPrice(state, action: PayloadAction<number>) {
            state.normalOption.price = action.payload;
        },
        setChildOptionPrice(state, action: PayloadAction<number>) {
            state.childOption.price = action.payload;
        },
        increaseNormalOption(state) {
            state.normalOption.count = state.normalOption.count - 1
            state.totalPrice = state.totalPrice - state.normalOption.price;
        },
        increaseChildOption(state) {
            state.childOption.count = state.childOption.count - 1
            state.totalPrice = state.totalPrice - state.childOption.price;
        },
        decreaseNormalOption(state) {
            state.normalOption.count = state.normalOption.count + 1
            state.totalPrice = state.totalPrice + state.normalOption.price;
        },
        decreaseChildOption(state) {
            state.childOption.count = state.childOption.count + 1
            state.totalPrice = state.totalPrice + state.childOption.price;
        },
        resetNormalOption(state) {
            state.normalOption = initialState.normalOption;
            state.totalPrice = 0;
        },
        resetChildOption(state) {
            state.childOption = initialState.childOption;
            state.totalPrice = 0;
        },
        postVerification(state, action: PayloadAction<boolean>) {
            state.postVerificationCode = action.payload;
        },
        checkVerification(state, action: PayloadAction<boolean>) {
            state.checkVerificationCode = action.payload;
        },
        setOrderHistory(state, action: PayloadAction<orderHistoryType>) {
            state.orderHistory = action.payload;
        },
        setOrderList(state, action: PayloadAction<Array<orderListType>>) {
            state.orderList = action.payload;
        },
        setOrderListCount(state, action: PayloadAction<number>) {
            state.orderListCount = action.payload;
        },
        reset(state) {
            Object.assign(state, initialState);
        },
    }
})

export const ticketAction = ticketSlice.actions;
export default ticketSlice;