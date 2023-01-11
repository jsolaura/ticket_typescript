import React from 'react';
import styles from "../../styles/Ticket.module.css";
import AlertTwoButton from "components/display/AlertTwoButton";
import { useHistory } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { myPageUrl } from "config/urlConfig";
import {useAppSelector} from "reducers/hooks";
import { cancelOrderService } from "../../service/TicketService";

const CompletedText = () => {
    return <span className={styles.completedText}>🥳 구매가 완료되었습니다.</span>
}
const orderInfoList = ['구매번호', '구매일자', '구매자명', '전화번호', '구매매수', '이용기간', '티켓 교환 여부'];
const OrderComplete = () => {
    const ticketDetail = useAppSelector((state) => state.ticket.ticketDetail);
    const orderHistory = useAppSelector((state) => state.ticket.orderHistory);
    const myPageToTicket = useAppSelector((state) => state.myPage.myPageToTicket);
    const isMobile = useMediaQuery({ query: "(max-width: 767px)" })
    const history = useHistory();

    const cancelTicket = () => {
        if (!myPageToTicket) {
            history.push(myPageUrl);
        } else {
            let orderId: string = orderHistory?.ticketOrder.orderId!;
            if (orderId) {
                AlertTwoButton(`티켓 구매 취소 시,${isMobile ? "\n" : ""} 결제 수단에 따라 ${!isMobile ? "\n" : ""}2-3영업일 이상${isMobile ? "\n" : ""} 소요될 수 있습니다. \n구매를 취소하시겠습니까?`, '구매취소', null, null, () => {
                    cancelOrderService(orderId, history);
                }, '취소');
            }
        }
    }
    const used = orderHistory?.ticketOrder?.used;
    const status = orderHistory?.ticketOrder?.status;
    return (
        <div className={`${styles.ticketWrapper} ${styles.orderWrapper}`}>
            <h2 className={styles.ticketHeader}>
                {isMobile && !myPageToTicket && <CompletedText />}
                구매 상세 정보
                {!isMobile && !myPageToTicket && <CompletedText />}
            </h2>
            <section className={styles.ticketInfo}>
                {!isMobile &&
                    <article className={styles.exhibitionImg}>
                        <img src={orderHistory?.exhibition?.imageUrl} alt={orderHistory?.exhibition?.name} />
                    </article>
                }
                <article className={`${styles.infoContainer} ${styles.orderContainer}`}>
                    <h3>{orderHistory?.exhibition?.name}</h3>
                    <ul className={styles.orderInfo}>
                        {orderInfoList.map((category, i) => {
                            let orderId = orderHistory?.ticketOrder?.orderId;
                            let purchaseDate = orderHistory?.ticketOrder?.formattedPurchasedDate;
                            let realName = orderHistory?.ticketOrder?.user_realname;
                            let cellphone = orderHistory?.ticketOrder?.user_cellphone;
                            let optionCount1 = orderHistory?.ticketOrder?.count_option1;
                            let optionCount2 = orderHistory?.ticketOrder?.count_option2;
                            let startDate = orderHistory?.ticket?.formattedStartDate;
                            let endDate = orderHistory?.ticket?.formattedEndDate;
                            let used = orderHistory?.ticketOrder?.used;
                            let status = orderHistory?.ticketOrder?.status;
                            return (
                                <li key={category}>
                                    <label>{i !== 6 && category}</label>
                                    <p className={`brElement`}>
                                        {i === 0 ? orderId :
                                            i === 1 ? purchaseDate :
                                                i === 2 ? realName :
                                                    i === 3 ? cellphone :
                                                        i === 4 ? optionCount1 !== 0
                                                            ? `성인 ${optionCount1}매 \n`
                                                            : optionCount2 !== 0
                                                                ? `소인 ${optionCount2}매` : "" :
                                                            i === 5 ? `${startDate} ~ ${endDate}`
                                                                : i === 6 && myPageToTicket &&
                                                                <span className={!used && status === 1 ? "blue" : status === 2 ? "blue" : status === 3 || status === 4 ? "red" : ""}>
                                                                    {used === false && status === 1 ? "미교환" :
                                                                        status === 2 ? "미교환" :
                                                                            status === 3 || status === 4 ? "구매 취소" :
                                                                                used === true && "교환"}
                                                                </span>

                                        }
                                    </p>
                                </li>
                            )
                        })}
                    </ul>
                    <label className={styles.orderTotal}>총 상품금액 <span><strong className={`fontFamEn`}>{orderHistory?.ticketOrder?.price.toLocaleString()}</strong> 원</span></label>
                    <button
                        onClick={() => cancelTicket}
                        className={`btn ${status === 4 ? styles.success : ""} ${!myPageToTicket ? "active" : ""}`}
                        disabled={
                            used || status === 2 || status === 3 || status === 4
                        }
                    >
                        {!myPageToTicket ? "티켓 구매내역"
                            : used ? "취소 불가"
                                : status === 2 ? "취소 불가"
                                    : !used && status === 1 ? "티켓 구매 취소"
                                        : status === 3 ? "티켓 구매 취소"
                                            : status === 4 && "취소 완료"
                        }
                    </button>
                </article>
            </section>
            <div className={styles.orderTicketInfo}>
                <span className={"spanInvalid"}>티켓은 구매 후 1회만 사용 가능합니다.</span>
                <p className={`brElement`}>{ticketDetail?.visitInfo}</p>
            </div>
        </div>
    );
};

export default OrderComplete;