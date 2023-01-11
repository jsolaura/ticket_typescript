import { commonAction } from "../reducers/common";
import store from "../reducers/store";

export const startTimer = (count: number, timerActive: boolean) => {
    if (count <= 0 || !timerActive) return;
    store.dispatch(commonAction.setTimerCount(count - 1))
}

export const resetTimer = () => {
    store.dispatch(commonAction.resetTimer());
}