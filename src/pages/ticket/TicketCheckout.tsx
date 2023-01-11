import React, { useEffect, useState } from 'react';
import styles from "../../styles/Ticket.module.css";
import TicketOrder from "./TicketOrder";
import VerificationModal from "components/modal/VerificationModal";
import { useHistory } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { ticketAction } from "reducers/ticket";
import { resetTimer, startTimer } from "utils/useControlTimer";
import useToggleState from "utils/useToggleState";
import { ticketDetailsUrl } from "config/urlConfig";
import { useCookies } from "react-cookie";
import {useAppDispatch, useAppSelector} from "reducers/hooks";
import { getUserInfo } from "../../service/MyPageService";

const TicketCheckout = () => {
    const history = useHistory();
    const isMobile = useMediaQuery({ query: "(max-width: 767px)" })
    const exhibition = useAppSelector((state) => state.ticket.exhibition);
    const ticketDetail = useAppSelector((state) => state.ticket.ticketDetail);
    const normalOption = useAppSelector((state) => state.ticket.normalOption)
    const childOption = useAppSelector((state) => state.ticket.childOption)
    const totalPrice = useAppSelector((state) => state.ticket.totalPrice)
    const checkVerificationCode = useAppSelector((state) => state.ticket.checkVerificationCode);
    const timerCount = useAppSelector((state) => state.common.timerCount);
    const timerActive = useAppSelector((state) => state.common.timerActive);
    const user = useAppSelector((state) => state.auth.user);
    let paragraph: Array<string> | undefined = ticketDetail?.visitInfo.split('\n');
    const [viewMore, onClickViewMore] = useToggleState(false);
    const [, setCookieUser] = useCookies(['user']);
    const [openPopup, setOpenPopup] = useState(false);

    const clickOpenPopup = () => setOpenPopup(true);
    const dispatch = useAppDispatch();

    useEffect(() => {
        getUserInfo(setCookieUser);
    }, [])
    useEffect(() => {
        let timerId = setInterval(() => startTimer(timerCount, timerActive), 1000);
        return () => clearInterval(timerId);
    });
    useEffect(() => {
        if (totalPrice === 0) {
            history.push(ticketDetailsUrl);
        }
    }, [totalPrice, history]);
    useEffect(() => {
        if (timerCount <= 0) {
            resetTimer();
            dispatch(ticketAction.checkVerification(false));
        }
    }, [timerCount])
    useEffect(() => {
        if (user.cellPhoneVerified) {
            dispatch(ticketAction.checkVerification(true));
        } else {
            dispatch(ticketAction.checkVerification(false));
        }
    },[user])
    return (
        <>
        <div className={`${styles.ticketWrapper} ${styles.ticketCheck}`}>
            <h2 className={styles.ticketHeader}>티켓 구매</h2>
            <section className={styles.verifContainer}>
                <article>
                    <h3>구매자 휴대폰 번호 인증</h3>
                    <p>
                        최초 구매시 1회 본인인증을 진행합니다. <br/>
                        티켓 구매 내역 및 현장 수령 확인에{isMobile ? <br/> : " "}사용됩니다.
                    </p>
                </article>
                <button onClick={clickOpenPopup} disabled={checkVerificationCode} className={`btn ${styles.verifBtn} ${checkVerificationCode ? styles.success : ''}`}>
                    {checkVerificationCode ? '번호 인증 완료' : '번호 인증 하기'}
                </button>
            </section>
            <section>
                <h3>티켓 정보</h3>
                <div className={`${styles.ticketInfo} ${styles.ticketCheckInfo}`}>
                    <article className={styles.exhibitionImg}>
                        <img src={exhibition?.imageUrl} alt={exhibition?.name} />
                    </article>
                    <article className={styles.infoContainer}>
                        <div className={`${styles.infoExhibition} ${styles.infoExhibitionCheck}`}>
                            <h3>{exhibition?.name}</h3>
                            <p>큐피커 (주)피플리</p>
                            <p>{`${exhibition?.formattedStartDate} ~ ${exhibition?.formattedEndDate}`}</p>
                        </div>
                        <div className={styles.orderHistoryContainer}>
                            <h3>
                                결제 금액
                                {isMobile && <button onClick={() => history.push(ticketDetailsUrl)} className={`btn ${styles.optionChange} ${styles.optionChangeM}`}>옵션 변경</button>}
                            </h3>
                            <ul>
                                {normalOption?.count !== 0 && (
                                    <li>
                                        <p>
                                            {normalOption?.title} <span>{normalOption.count}</span>매
                                            <b>{normalOption?.subTitle}</b>
                                        </p>
                                        <p className={`fontFamEn`}>{normalOption ? normalOption?.price.toLocaleString() : 0} 원</p>
                                    </li>
                                )}
                                {childOption?.count !== 0 && (
                                    <li>
                                        <p>{childOption?.title} <span>{childOption.count}</span>매
                                            <b>{childOption?.subTitle}</b>
                                        </p>
                                        <p className={`fontFamEn`}>{childOption ? childOption?.price.toLocaleString() : 0} 원</p>
                                    </li>
                                )}
                            </ul>
                            <p className={styles.totalPrice}>
                                총 상품 금액
                                <span className={`fontFamEn`}>{totalPrice ? totalPrice.toLocaleString() : 0} 원</span>
                            </p>
                        </div>
                        {!isMobile && <button onClick={() => history.push(ticketDetailsUrl)} className={`btn ${styles.optionChange}`}>옵션 변경</button>}
                    </article>
                </div>
            </section>
            <section className={styles.checkVisitInfo}>
                <h3>전시 관람 안내</h3>
                <div className={`brElement `}>
                    {paragraph &&
                        paragraph.length > 3 && !viewMore ? (
                            `${paragraph[0] } \n` +
                            `${paragraph[1] } \n` +
                            `${paragraph[2] } \n`
                        ) : viewMore && ticketDetail?.visitInfo
                    }
                </div>
                <button className={`${styles.viewMoreBtn} ${viewMore ? styles.view : ""}`} onClick={onClickViewMore} type={"button"}>
                    {!viewMore ? "더보기 " : "접기"}<span />
                </button>
            </section>
            <TicketOrder />
        </div>
        <VerificationModal openPopup={openPopup} setOpenPopup={setOpenPopup} />
        </>
    );
};

export default TicketCheckout;