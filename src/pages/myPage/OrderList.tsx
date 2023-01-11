import React, { MouseEvent } from 'react';
import styles from "../../styles/MyPage.module.css";
import noTicket from "assets/images/noTicket.svg";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router-dom";
import { ticketAction } from "reducers/ticket";
import { myPageAction } from "reducers/myPage";
import { useAppDispatch, useAppSelector } from "reducers/hooks";
import { listType } from "../../types/myPageType";

const List = ({order, used, status}: listType) => {
    const isMobile = useMediaQuery({ query: "(max-width: 480px)" });
    const dispatch = useAppDispatch();
    const history = useHistory();

    const moveToDetail = (e: MouseEvent) => {
        e.preventDefault();
        dispatch(ticketAction.setOrderHistory(order));
        dispatch(myPageAction.setMyPageToTicket(true));
        history.push(`/myPage/ticketOrder/detail/${order?.ticketOrder?.orderId}`);
    }
    return (
        <button onClick={(e) => moveToDetail(e)} className={`${styles.list} ${used || status > 1 ? styles.detail : ""}`}>
            <div className={`${styles.imgContainer} ${used || status > 1 ? "dimmedEl" : ""}`}>
                <span className={styles.detailLabel}>
                    {!used && status === 2 ? "이용기한 만료" :
                        !used && status === 3 ? "환불 대기" :
                            !used && status === 4 ? "구매 취소" :
                                used && "사용 완료"
                    }
                </span>
                <img src={order?.exhibition?.imageUrl} alt={order?.exhibition?.name} />
            </div>
            <div className={styles.infoContainer}>
                <h4 className={isMobile ? "ellipsis1" : ""}>{order?.exhibition?.name}</h4>
                <div>
                    <p>{order?.ticket?.hostInfo}</p>
                    <span>{order?.ticket?.formattedStartDate} ~ {order?.ticket?.formattedEndDate}</span>
                </div>
            </div>
        </button>
    )
}
const OrderList = () => {
    const orderList = useAppSelector((state) => state.ticket.orderList);
    const orderListCount = useAppSelector((state) => state.ticket.orderListCount);
    const viewMore = useAppSelector((state) => state.myPage.viewMore);
    const dispatch = useAppDispatch();

    const onClickViewMore = () => {
        dispatch(myPageAction.setViewMore(!viewMore));
    }
    return (
        <article className={styles.orderList}>
            <h3>
                구매 내역
                {orderListCount > 3 && <button onClick={onClickViewMore} className={"underLine"}>{!viewMore ? "더보기" : "접기"}</button>}
            </h3>
            <div className={styles.orderTicketList}>
                {orderListCount === 0 ?
                    <label className={styles.noTicketData}>
                        <img src={noTicket} alt={"noTicketData"} />
                        <span>구매 내역이 없습니다.</span>
                    </label>
                    : (
                        !viewMore ? (
                            orderList?.slice(0, 3).map(order => {
                                let status = order.ticketOrder.status;
                                let used = order.ticketOrder.used;
                                let id = order.ticketOrder.orderId;
                                return (
                                    <div key={id}>
                                        <List order={order} used={used} status={status} />
                                    </div>
                                )
                            })
                        ) : (
                            orderList?.map(order => {
                                let status = order.ticketOrder.status;
                                let used = order.ticketOrder.used;
                                let id = order.ticketOrder.orderId;
                                return (
                                    <div key={id}>
                                        <List order={order} used={used} status={status} />
                                    </div>
                                )
                            })
                        )
                    )
                }
            </div>
        </article>
    );
};

export default OrderList;