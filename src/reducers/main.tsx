import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface stateType {
    cursor: boolean;
}
const initialState: stateType = {
    cursor: false,
}

const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        setCursor(state, action: PayloadAction<boolean>) {
            state.cursor = action.payload;
        },
        reset(state) {
            Object.assign(state, initialState);
        }
    }
})
export const mainAction = mainSlice.actions;
export default mainSlice;