import http from 'config/Http-common';
import AlertBasic from "components/display/AlertBasic";
import store from "reducers/store";
import { commonAction } from "reducers/common";
import { ticketAction } from "reducers/ticket";
import { myPageUrl } from "config/urlConfig";
import { getCookie } from "config/cookie";
import { setUserToken } from "utils/useSetUserToken";
import Bootpay from "@bootpay/client-js";
import {OptionsType} from "../types/ticketType";

const ticketList = () => {
    return http.get(`/web/exhibitions/ticket?exhibitionId=${process.env.REACT_APP_TICKET_ID}`);
}
const createOrderId = (ticketId) => {
    setUserToken();
    return http.post(`/api/v1/order/ticket?ticketId=${ticketId}&volume=normal`);
}
const checkOrderHistory = (data, ticketId, normalOptionCount, childOptionCount) => {
    setUserToken();
    return http.post(
        `/api/v2/order/ticket/verify?ticketId=${ticketId}&count_option_1=${normalOptionCount !== "" ? normalOptionCount : 0}&count_option_2=${childOptionCount !== "" ? childOptionCount : 0}&count_option_3&count_option_4&count_option_5&count_option_6&count_option_7&count_option_8&count_option_9&count_option_10`,
        data
    )
}
const postSuccessOrderHistory = (orderId) => {
    setUserToken();
    return http.post(`/api/v1/order/ticket/complete-message?orderId=${orderId}`);
}
const cancelOrder = (orderId) => {
    setUserToken();
    return http.post(`/api/v1/order/ticket/request/cancel?orderId=${orderId}`);
}

export const cancelOrderService = (orderId: string, history: History | any) => {
    store.dispatch(commonAction.setLoading(true));
    cancelOrder(orderId)
        .then(response => {
            if (response.data.responseCode === 'FAIL') {
                store.dispatch(commonAction.setLoading(false));
                if (response.data.message === 'order_004') {
                    AlertBasic('환불 대기중인 주문 건 입니다.', null);
                } else {
                    AlertBasic('유효하지 않은 주문 건 입니다.', null);
                }
            } else {
                store.dispatch(commonAction.setLoading(false));
                AlertBasic('구매 취소 요청이 완료되었습니다.', () => {
                    history.push(myPageUrl)
                }, false, true);
            }
        })
        .catch(err => console.log(err));
}
export const checkOrderHistoryService = async (
    ticketId: number,
    paymentValue: any,
    totalPrice: number,
    normalOption: OptionsType,
    childOption: OptionsType,
    history: History | any,
) => {
    let data;
    createOrderId(ticketId)
        .then(async response => {
            const orderHistory = response.data.data;
            const user = getCookie('user');
            const orderId = orderHistory.ticketOrder.orderId;
            store.dispatch(ticketAction.setOrderHistory(orderHistory));
            let items: Array<any> = [];
            if (normalOption.count > 0) {
                data = {
                    "id": orderHistory.ticketOptionList[0].id.toString(),
                    "name": orderHistory.ticketOptionList[0].name,
                    "qty": normalOption.count,
                    "price": normalOption.price,
                };
                items.push(data);
            }
            if (childOption.count > 0) {
                data = {
                    "id": orderHistory.ticketOptionList[1].id.toString(),
                    "name": orderHistory.ticketOptionList[1].name,
                    "qty": childOption.count,
                    "price": childOption.price,
                };
                items.push(data);
            }
            try {
                const response = await Bootpay.requestPayment({
                    "application_id": paymentValue === "card" ? process.env.REACT_APP_BOOTPAY_APPLICATION_ID_BY_CARD : process.env.REACT_APP_BOOTPAY_APPLICATION_ID,
                    "price": totalPrice,
                    "order_name": orderHistory.exhibition.name,
                    "order_id": orderId,
                    "pg": 'nicepay',
                    "method": paymentValue,
                    "tax_free": 0,
                    "user": {
                        "id": orderHistory.ticketOrder.userId,
                        "username": orderHistory.ticketOrder.user_realname,
                        "phone": orderHistory.ticketOrder.user_cellphone,
                        "email": user.email,
                    },
                    "items": items,
                    "extra": {
                        "open_type": "popup",
                        "card_quota": "0,2,3",
                        "escrow": false
                    }
                })
                switch (response.event) {
                    case 'issued':
                        // 가상계좌 입금 완료 처리
                        break
                    case 'confirm':
                        //payload.extra.separately_confirmed = true; 일 경우 승인 전 해당 이벤트가 호출됨
                        break
                    case 'done':
                        // 주문 완료 후 티켓 검증 데이터 가공
                        store.dispatch(commonAction.setLoading(true));
                        store.dispatch(commonAction.setLoadingCustom(true));
                        store.dispatch(commonAction.setLoadingText('구매'));
                        let normalOptionCount = normalOption.count > 0 ? normalOption.count : "";
                        let childOptionCount = childOption.count > 0 ? childOption.count : "";
                        let orderData = {
                            "action": "BootpayDone",
                            "amount": null,
                            "phone": null,
                            "params": null,
                            "item_name":  response.data.order_name,
                            "receipt_id": response.data.receipt_id,
                            "order_id": response.data.order_id,
                            "url": "https://app.bootpay.co.kr",
                            "price": response.data.price,
                            "tax_free": 0,
                            "payment_name": response.data.method_origin,    // 카카오페이, 네이버페이, 페이코
                            "pg_name": response.data.pg,
                            "pg": "nicepay",
                            "method": response.data.method_origin_symbol,   //  kakaopay, payco, naverpay, card
                            "method_name": response.data.method_origin,     // 카카오페이, 네이버페이, 페이코
                            "payment_group": response.data.method_symbol,   // card, kakao_money
                            "payment_group_name": response.data.method === "카드" ? "신용카드" : response.data.method,    // 카드, 카카오머니,
                            "requested_at": response.data.requested_at,
                            "purchased_at": response.data.purchased_at,
                            "status": 1
                        }
                        // 주문 완료 후 티켓 검증
                        checkOrderHistory(orderData, orderHistory.ticket.id, normalOptionCount, childOptionCount)
                            .then(responseServer => {
                                store.dispatch(ticketAction.setOrderHistory(responseServer.data.data));

                                // 구매 완료 휴대폰 문자 전송
                                if (responseServer.data.responseCode === 'SUCCESS') {
                                    postSuccessOrderHistory(orderId)
                                        .then(responseServerPost => {
                                            if (responseServerPost.data.responseCode === 'SUCCESS') {
                                                store.dispatch(commonAction.setLoading(false));
                                                store.dispatch(commonAction.setLoadingCustom(false))
                                                history.push(`/ticketDetails/ticketOrder/completed/${orderId}`);
                                            }
                                        })
                                        .catch(err => console.log(err));
                                } else {
                                    store.dispatch(commonAction.setLoading(false));
                                    store.dispatch(commonAction.setLoadingCustom(false))
                                    AlertBasic(`구매 처리 중 문제가 발생했습니다. \n ${responseServer.data.message}`, null);
                                }
                            })
                            .catch(err => console.log(err));
                        break
                    default : break;
                }
            } catch (e: any) {
                // 결제 진행중 오류 발생
                // e.error_code - 부트페이 오류 코드
                // e.pg_error_code - PG 오류 코드
                // e.message - 오류 내용
                // console.log(e)

                switch (e.event) {
                    case 'cancel':
                        // 사용자가 결제창을 닫을때 호출
                        AlertBasic(`결제 진행을 취소했습니다.`, null);
                        break
                    case 'error':
                        // 결제 승인 중 오류 발생시 호출
                        if (e.error_code === "RC_PRICE_LEAST_LT") {
                            AlertBasic(`최소금액 100원 이상 결제를 요청해주세요.`, null);
                        }
                        if (e.payload.ResultCode === 'EP07') {
                            AlertBasic(`카드 인증정보 조회를 실패하였습니다.`, null);
                        } else {
                            AlertBasic(`결제 진행을 취소했습니다.`, null);
                        }
                        break;
                    default : break;
                }
            }
        })
        .catch(err => console.log(err));
}
export const getTicketList = () => {
    ticketList()
        .then(response => {
            const exhibition = response.data.data.exhibition;
            const ticketDetail = response.data.data.ticket;
            const ticketOptionList = response.data.data.ticketOptionList;
            console.log(ticketOptionList);
            store.dispatch(ticketAction.setExhibition(exhibition));
            store.dispatch(ticketAction.setTicketDetail(ticketDetail));
            store.dispatch(ticketAction.setTicketOptionList(ticketOptionList));
        })
        .catch(err => console.log(err));
}
