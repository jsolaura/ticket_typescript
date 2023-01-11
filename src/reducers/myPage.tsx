import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface stateType {
    viewMore: boolean;
    myPageToTicket: boolean;
}
const initialState: stateType = {
    viewMore: false,
    myPageToTicket: false,
}

const myPageSlice = createSlice({
    name: 'myPage',
    initialState,
    reducers: {
        setViewMore(state, action: PayloadAction<boolean>) {
            state.viewMore = action.payload;
        },
        setMyPageToTicket(state, action: PayloadAction<boolean>) {
            state.myPageToTicket = action.payload;
        },
        reset(state) {
            Object.assign(state, initialState);
        }
    }
})
export const myPageAction = myPageSlice.actions;
export default myPageSlice;