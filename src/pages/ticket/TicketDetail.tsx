import React, { useEffect } from 'react';
import styles from "../../styles/Ticket.module.css";
import GoToTop from "components/layout/GoToTop";
import { updateScroll } from "utils/useUpdateScroll";
import useToggleState from "utils/useToggleState";
import {useAppSelector} from "reducers/hooks";
import { parsingHtml } from 'utils/useParsingHtml';
import TicketInfo from './TicketInfo';
import { getTicketList } from "../../service/TicketService";

const TicketDetail = () => {
    const exhibition = useAppSelector((state) => state.ticket.exhibition);
    const ticketDetail = useAppSelector((state) => state.ticket.ticketDetail);
    const [viewMore, onClickViewMore] = useToggleState(false);

    useEffect(() => {
        getTicketList();
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', updateScroll);
        return () => window.removeEventListener('scroll', updateScroll);
    })
    return (
        <div className={`${styles.ticketWrapper}`}>
            {exhibition &&
                <>
                <h2 className={styles.ticketHeader}>
                    {exhibition?.name}
                </h2>
                <TicketInfo />
                <section className={styles.detailWrap}>
                    <h4>상세정보</h4>
                    <article className={styles.detailInfoContainer}>
                        <div className={`${styles.detailInfo} ${viewMore ? styles.view : ""}`}>
                            <div dangerouslySetInnerHTML={parsingHtml(ticketDetail?.detailInfo)} />
                        </div>
                    </article>
                </section>
                <button className={`${styles.viewMoreBtn} ${viewMore ? styles.view : ""}`} onClick={onClickViewMore} type={"button"}>
                    상세정보 {!viewMore ? "더보기" : "접기"}<span />
                </button>
                <section className={styles.subInfo}>
                    <h4>부가정보</h4>
                    <article>
                        <div className={"brElement"} dangerouslySetInnerHTML={parsingHtml((ticketDetail?.visitInfo))} />
                    </article>
                </section>
                <GoToTop value={80} />
                </>
            }
        </div>
    );
};

export default TicketDetail;