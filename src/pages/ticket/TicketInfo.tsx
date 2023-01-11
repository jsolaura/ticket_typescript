import React, {useEffect, useState} from 'react';
import styles from "../../styles/Ticket.module.css";
import AlertTwoButton from "components/display/AlertTwoButton";
import { ticketAction } from "reducers/ticket";
import { commonAction } from "reducers/common";
import { authAction } from "reducers/auth";
import { useMediaQuery } from "react-responsive";
import { useHistory } from "react-router-dom";
import { RegexOption } from "utils/useRegexOption";
import store from "reducers/store";
import { loginUrl, ticketCheckoutUrl } from "config/urlConfig";
import {useAppDispatch, useAppSelector} from "reducers/hooks";
import {buyBtnType, infoOptionType} from "../../types/ticketType";

const InfoOption = ({ isMobile, overCount }: infoOptionType) => {
    const ticketOptionList = useAppSelector((state) => state.ticket.ticketOptionList);
    const normalOption = useAppSelector((state) => state.ticket.normalOption);
    const childOption = useAppSelector((state) => state.ticket.childOption);
    const totalPrice = useAppSelector((state) => state.ticket.totalPrice);
    const dispatch = useAppDispatch();

    const increaseOption = (type: string) => {
        if (type === "normal") dispatch(ticketAction.increaseNormalOption());
        else dispatch(ticketAction.increaseChildOption());
    }
    const decreaseOption = (type: string) => {
        if (type === "normal") dispatch(ticketAction.decreaseNormalOption());
        else dispatch(ticketAction.decreaseChildOption());
    }
    return (
        <div className={styles.infoOption}>
            <h3>권종 선택</h3>
            <ul>
                {ticketOptionList?.map((option, i) => {
                    const data = option;
                    let count = i === 0 ? normalOption.count : childOption.count;
                    return (
                        <li key={data?.id}>
                            <RegexOption data={data.name} />
                            <div className={styles.btnContainer}>
                                <button disabled={count === 0} onClick={() => increaseOption(i === 0 ? "normal" : "")} className={styles.minus} />
                                <p>{i === 0 ? normalOption.count : childOption.count}</p>
                                <button disabled={overCount} onClick={() => decreaseOption(i === 0 ? "normal" : "")} className={styles.plus} />
                            </div>
                            {!isMobile && <b>{data?.price.toLocaleString()} 원</b>}
                        </li>
                    )
                })}
            </ul>
            <div className={styles.totalPrice}>
                <label>총 상품 금액</label>
                <span>
                    <strong>{totalPrice.toLocaleString()}</strong> 원
                </span>
            </div>
        </div>

    )
}
const BuyBtn = ({ totalPrice, moveToBuyTicket }: buyBtnType) => {
    return (
        <button disabled={totalPrice === 0} onClick={moveToBuyTicket} className={`${styles.buyBtn} btn`}>티켓 구매</button>
    )
}
const TicketInfo = () => {
    const isLoggedIn = useAppSelector(((state) => state.auth.isLoggedIn));
    const exhibition = useAppSelector((state) => state.ticket.exhibition);
    const ticketOptionList = useAppSelector((state) => state.ticket.ticketOptionList);
    const ticketDetail = useAppSelector((state) => state.ticket.ticketDetail);
    const totalPrice = useAppSelector((state) => state.ticket.totalPrice);
    const normalOption = useAppSelector((state) => state.ticket.normalOption);
    const childOption = useAppSelector((state) => state.ticket.childOption);
    const infoList = ['장소', '주최/기획', '기간', '고객 문의', '티켓 사용 유효 기간', '관람 등급', '수령 방법'];
    const isPc = useMediaQuery({query: "(min-width: 1080px)"});
    const isTablet = useMediaQuery({query: "(min-width: 768px) and (max-width: 1080px)"});
    const isMobile = useMediaQuery({ query: "(max-width: 767px)" })

    const dispatch = useAppDispatch();
    const history = useHistory();

    const [overCount, setOverCount] = useState(false);

    useEffect(() => {
        let totalCount = normalOption.count + childOption.count;
        if (totalCount >= 10) setOverCount(true);
        else setOverCount(false);
    },[normalOption, childOption]);

    useEffect(() => {
        store.dispatch(commonAction.setLoading(true));
        if (ticketOptionList) {
            dispatch(ticketAction.setNormalOptionPrice(ticketOptionList[0]?.price));
            dispatch(ticketAction.setChildOptionPrice(ticketOptionList[1]?.price));
        }
        dispatch(commonAction.setLoading(false));
    }, [ticketOptionList]);

    const moveToBuyTicket = () => {
        if (!isLoggedIn) {
            AlertTwoButton('로그인이 필요한 서비스입니다.', '로그인', null, null, () => {
                dispatch(authAction.setLoginRootFrom('ticket'));
                history.push(loginUrl);
            })
        } else {
            history.push(ticketCheckoutUrl)
        };
    }
    return (
        <>
        <section className={styles.ticketInfo}>
            <article className={styles.exhibitionImg}>
                <img src={exhibition?.imageUrl} alt={exhibition?.name} />
            </article>
            {isMobile && (
                <>
                <InfoOption isMobile={true} overCount={overCount} />
                <BuyBtn totalPrice={totalPrice} moveToBuyTicket={moveToBuyTicket} />
                </>
            )}
            <article className={styles.infoContainer}>
                <div className={styles.infoExhibition}>
                    <h3>전시 정보</h3>
                    <ul>
                        {infoList.map((category, i) => {
                            return (
                                <li key={category}>
                                    <label>{category}</label>
                                    {ticketDetail !== null ? (
                                        i === 0 ? (
                                            <a className={styles.placeLink} target={"_blank"} rel="noreferrer" href={"https://map.naver.com/v5/entry/place/1410492841?placePath=%2Fhome&c=14135278.1639976,4519480.2048020,15,0,0,0,dh"}>
                                                {ticketDetail?.placeInfo}
                                            </a>
                                        ) : (
                                            <p>{i === 1 ? ticketDetail?.hostInfo
                                                : i === 2 ? `${ticketDetail?.formattedStartDate } ~ ${ticketDetail?.formattedEndDate}`
                                                    : i === 3 ? ticketDetail?.cancelInfo
                                                        : i === 4 ? ticketDetail?.dateInfo
                                                            : i === 5 ? ticketDetail?.ratingInfo
                                                                : i === 6 && ticketDetail?.exchangeInfo
                                            }</p>
                                        )
                                    ) : null
                                    }
                                </li>
                            )
                        })}
                    </ul>
                </div>
                {isPc && <InfoOption overCount={overCount} />}
            </article>
            <article className={styles.optionContainer}>
                {isTablet && <InfoOption overCount={overCount} />}
            </article>
        </section>
        {!isMobile && <BuyBtn totalPrice={totalPrice} moveToBuyTicket={moveToBuyTicket} />}
        </>
    );
};

export default TicketInfo;