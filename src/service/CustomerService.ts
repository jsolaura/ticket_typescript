import http from 'config/Http-common';
import { commonAction } from "reducers/common";
import AlertBasic from "components/display/AlertBasic";
import store from "reducers/store";
import React from "react";
import { inputsType } from "../types/customerType";

const notice = (pageNumber: number | string, pageSize: number | string) => {
    return http.get(`/notices?pageNumber=${pageNumber}&pageSize=${pageSize}`);
}
const submitCS = (data: any) => {
    return http.post(`/web/submitCS`, data);
}
export const getNoticeList = (pageNumber: number | string, pageSize: number | string) => {
    notice(pageNumber, pageSize)
        .then(response => {
            store.dispatch(commonAction.setNoticeList(response.data.data));
            store.dispatch(commonAction.setNoticeTotalCount(response.data.totalCount));
        })
        .catch(err => console.log(err));
}
export const postSubmitCs = (data: any, setInput: React.Dispatch<React.SetStateAction<inputsType>>,) => {
    store.dispatch(commonAction.setLoading(true));
    submitCS(data)
        .then(response => {
            AlertBasic('문의사항이 접수되었습니다. \n 빠른 시일 내에 답변 드리도록 하겠습니다.', () => {
                setInput({
                    userName: "",
                    userEmail: "",
                    userNumber: "",
                    content: "",
                })
                store.dispatch(commonAction.setLoading(false));
            })
            store.dispatch(commonAction.setLoading(false));
        })
        .catch(err => console.log(err));
}
