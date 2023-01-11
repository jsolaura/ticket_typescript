import { ticketAction } from "reducers/ticket";
import store from "../reducers/store";

export const resetOptions = () => {
    store.dispatch(ticketAction.resetNormalOption());
    store.dispatch(ticketAction.resetChildOption());
}