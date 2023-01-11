import React from 'react';
import styles from "../../styles/Ticket.module.css";
import phone from "assets/images/phone.svg";
import card from "assets/images/card.svg";
import payco from "assets/images/payco.svg";
import kakaoPay from "assets/images/kakaoPay.svg";
import naverPay from "assets/images/naverPay.svg";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router-dom";
import useToggleState from "utils/useToggleState";
import useChangeState from "utils/useChangeState";
import {useAppSelector} from "reducers/hooks";
import { checkOrderHistoryService } from "../../service/TicketService";
const paymentList = [
    {'title': '휴대폰 결제', 'icon': phone, 'en': 'phone'},
    {'title': '신용/체크카드', 'icon': card, 'en': 'card'},
    {'title': '페이코', 'icon': payco, 'en': 'payco'},
    {'title': '카카오페이', 'icon': kakaoPay, 'en': 'kakao'},
    {'title': '네이버페이', 'icon': naverPay, 'en': 'npay'},
];
const TicketOrder = () => {
    const ticketDetail = useAppSelector((state) => state.ticket.ticketDetail);
    const normalOption = useAppSelector((state) => state.ticket.normalOption);
    const childOption = useAppSelector((state) => state.ticket.childOption);
    const totalPrice = useAppSelector((state) => state.ticket.totalPrice);
    const checkVerificationCode = useAppSelector((state) => state.ticket.checkVerificationCode);

    const isMobile = useMediaQuery({ query: "(max-width: 767px)" })
    const [policyCheck, onClickActive] = useToggleState(false);
    const [paymentValue, onChangePayment] = useChangeState('phone');
    const history = useHistory();

    const checkOrderHistory = () => {
        if (ticketDetail) {
            checkOrderHistoryService(ticketDetail?.id, paymentValue, totalPrice, normalOption, childOption, history)
            .catch(err => console.log(err));
        }
    }
    return (
        <>
        <section className={styles.paymentContainer}>
            <h3>결제 방법</h3>
            <div>
                {paymentList.map((value, i) => (
                    <label htmlFor={value.en} key={value.title} className={`${styles.paymentLabel} ${paymentValue === value.en ? styles.active : ""}`}>
                        <input id={value.en} name={"paymentList"} onChange={(e) => onChangePayment(e)} value={value.en} type={"radio"}/>
                        {!isMobile && <img src={value.icon} alt={value.title}/>}
                        {value.title}
                    </label>
                ))}
            </div>
            <button onClick={onClickActive} className={styles.policyBtn}>
                <span className={`checkBtn policyCheck ${policyCheck ? 'active' : ''}`} />
                <p>이용약관 및 개인정보 {isMobile && <br/>} 제 3자 제공사항에 대해 확인하였으며 결제에 동의합니다. (필수)</p>
            </button>
        </section>
        <button onClick={checkOrderHistory} disabled={!checkVerificationCode || !policyCheck} className={`btn ${styles.checkoutBtn}`}>구매하기</button>
        </>
    );
};

export default TicketOrder;