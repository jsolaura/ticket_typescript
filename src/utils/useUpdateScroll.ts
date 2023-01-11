import {commonAction } from "reducers/common";
import store from "reducers/store";

export const updateScroll = () => {
    store.dispatch(commonAction.setScrollY(window.scrollY || document.documentElement.scrollTop))
}