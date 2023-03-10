import React from 'react';
import styles from "../../styles/Ticket.module.css";
import AlertTwoButton from "components/display/AlertTwoButton";
import { useHistory } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { myPageUrl } from "config/urlConfig";
import {useAppSelector} from "reducers/hooks";
import { cancelOrderService } from "../../service/TicketService";

const CompletedText = () => {
    return <span className={styles.completedText}>๐ฅณ ๊ตฌ๋งค๊ฐ ์๋ฃ๋์์ต๋๋ค.</span>
}
const orderInfoList = ['๊ตฌ๋งค๋ฒํธ', '๊ตฌ๋งค์ผ์', '๊ตฌ๋งค์๋ช', '์ ํ๋ฒํธ', '๊ตฌ๋งค๋งค์', '์ด์ฉ๊ธฐ๊ฐ', 'ํฐ์ผ ๊ตํ ์ฌ๋ถ'];
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
                AlertTwoButton(`ํฐ์ผ ๊ตฌ๋งค ์ทจ์ ์,${isMobile ? "\n" : ""} ๊ฒฐ์  ์๋จ์ ๋ฐ๋ผ ${!isMobile ? "\n" : ""}2-3์์์ผ ์ด์${isMobile ? "\n" : ""} ์์๋  ์ ์์ต๋๋ค. \n๊ตฌ๋งค๋ฅผ ์ทจ์ํ์๊ฒ ์ต๋๊น?`, '๊ตฌ๋งค์ทจ์', null, null, () => {
                    cancelOrderService(orderId, history);
                }, '์ทจ์');
            }
        }
    }
    const used = orderHistory?.ticketOrder?.used;
    const status = orderHistory?.ticketOrder?.status;
    return (
        <div className={`${styles.ticketWrapper} ${styles.orderWrapper}`}>
            <h2 className={styles.ticketHeader}>
                {isMobile && !myPageToTicket && <CompletedText />}
                ๊ตฌ๋งค ์์ธ ์ ๋ณด
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
                                                            ? `์ฑ์ธ ${optionCount1}๋งค \n`
                                                            : optionCount2 !== 0
                                                                ? `์์ธ ${optionCount2}๋งค` : "" :
                                                            i === 5 ? `${startDate} ~ ${endDate}`
                                                                : i === 6 && myPageToTicket &&
                                                                <span className={!used && status === 1 ? "blue" : status === 2 ? "blue" : status === 3 || status === 4 ? "red" : ""}>
                                                                    {used === false && status === 1 ? "๋ฏธ๊ตํ" :
                                                                        status === 2 ? "๋ฏธ๊ตํ" :
                                                                            status === 3 || status === 4 ? "๊ตฌ๋งค ์ทจ์" :
                                                                                used === true && "๊ตํ"}
                                                                </span>

                                        }
                                    </p>
                                </li>
                            )
                        })}
                    </ul>
                    <label className={styles.orderTotal}>์ด ์ํ๊ธ์ก <span><strong className={`fontFamEn`}>{orderHistory?.ticketOrder?.price.toLocaleString()}</strong> ์</span></label>
                    <button
                        onClick={() => cancelTicket}
                        className={`btn ${status === 4 ? styles.success : ""} ${!myPageToTicket ? "active" : ""}`}
                        disabled={
                            used || status === 2 || status === 3 || status === 4
                        }
                    >
                        {!myPageToTicket ? "ํฐ์ผ ๊ตฌ๋งค๋ด์ญ"
                            : used ? "์ทจ์ ๋ถ๊ฐ"
                                : status === 2 ? "์ทจ์ ๋ถ๊ฐ"
                                    : !used && status === 1 ? "ํฐ์ผ ๊ตฌ๋งค ์ทจ์"
                                        : status === 3 ? "ํฐ์ผ ๊ตฌ๋งค ์ทจ์"
                                            : status === 4 && "์ทจ์ ์๋ฃ"
                        }
                    </button>
                </article>
            </section>
            <div className={styles.orderTicketInfo}>
                <span className={"spanInvalid"}>ํฐ์ผ์ ๊ตฌ๋งค ํ 1ํ๋ง ์ฌ์ฉ ๊ฐ๋ฅํฉ๋๋ค.</span>
                <p className={`brElement`}>{ticketDetail?.visitInfo}</p>
            </div>
        </div>
    );
};

export default OrderComplete;