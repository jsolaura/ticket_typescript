import React, { useRef } from 'react';
import styles from '../../styles/Main.module.css';
import mainLeftPc from "assets/images/mainL.svg";
import pMainLeftPc from "assets/images/mainL.png";
import mainRightPc from "assets/images/mainR.svg";
import pMainRightPc from "assets/images/mainR.png";
import mainMobile from "assets/images/mainM.svg";
import pMainMobile from "assets/images/mainM.png";
import Footer from "components/layout/Footer";
import Cursor from "components/cursor/Cursor";
import PlaceholderImage from "components/display/PlaceholderImage";
import { useHistory } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { mainAction } from "reducers/main";
import { ticketDetailsUrl } from "config/urlConfig";
import { useAppDispatch, useAppSelector } from "reducers/hooks";

const TicketMain = () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const isPc = useMediaQuery({ query: "(min-width: 1080px)" });
    const cursor = useAppSelector((state) => state.main.cursor);
    const mainRef = useRef(null);
    const isMobile = useMediaQuery({ query: "(max-width: 767px)" })
    const dispatch = useAppDispatch();
    const history = useHistory();

    const onMouseEnter = () => dispatch(mainAction.setCursor(true));
    const onMouseLeave = () => dispatch(mainAction.setCursor(false));
    const moveToTicket = () => {
        history.push(ticketDetailsUrl);
    }

    return (
        <>
        {/*{isPc && cursor && <Cursor />}*/}
        <div ref={mainRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={`${styles.mainWrap}`}>
            <div className={styles.mainLeft} onClick={moveToTicket}>
                {isMobile ? <PlaceholderImage src={mainMobile} placeholderSrc={pMainMobile} alt={"main image"} />
                    : <PlaceholderImage src={mainLeftPc} placeholderSrc={pMainLeftPc} alt={"main image left side"} />
                }
                {/*<button className={styles.mainTicketBtn} onClick={moveToTicket} />*/}
                <div className={styles.btnContainer}>
                    {/*<div className={`arrow ${styles.arrow} ${!isPc ? "m" : ""}`}>*/}
                    {/*    {isMobile ? (*/}
                    {/*        arr.map(i => (*/}
                    {/*            <span key={i} className={`a${i}`} />*/}
                    {/*        ))*/}
                    {/*    ) : (*/}
                    {/*        arr.slice(0, 5).map(i => (*/}
                    {/*            <span key={i} className={`a${i}`} />*/}
                    {/*        ))*/}
                    {/*    )}*/}
                    {/*</div>*/}
                    {/*{isMobile ? <button onClick={moveToTicket} className={styles.mainTicketBtnM} />*/}
                    {/*    : (*/}
                    {/*        <em>*/}
                    {/*            <button onClick={moveToTicket} className={styles.mainTicketBtn} />*/}
                    {/*        </em>*/}
                    {/*    )*/}
                    {/*}*/}
                </div>
            </div>
            {!isMobile &&
                <div className={`${styles.mainRight}`}>
                    <PlaceholderImage src={mainRightPc} placeholderSrc={pMainRightPc} alt={"main image right side"} />
                    {/*<em className={styles.welcome} />*/}
                </div>
            }
        </div>
        <Footer />
        </>
)   ;
};

export default TicketMain;