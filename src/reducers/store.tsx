import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./auth";

import commonSlice from "./common";
import mainSlice from "reducers/main";
import ticketSlice from "reducers/ticket";
import myPageSlice from "reducers/myPage";

const rootReducer = combineReducers({
    common: commonSlice.reducer,
    auth: authSlice.reducer,
    main: mainSlice.reducer,
    ticket: ticketSlice.reducer,
    myPage: myPageSlice.reducer,
});
const persistConfig = {
    key: 'root',
    storage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;