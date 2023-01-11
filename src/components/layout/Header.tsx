import React from 'react';
import styles from "../../styles/Header.module.css";
import logo from 'assets/images/qpicker-logo.svg';
import ticketKor from 'assets/images/ticketKor.svg';
import ticketEng from 'assets/images/ticketEng.svg';
// import Tooltip from "../display/Tooltip";
import { Link, NavLink } from "react-router-dom";
import { loginUrl, mainUrl, myPageUrl } from "config/urlConfig";
import {useAppSelector} from "reducers/hooks";
// import { useMediaQuery } from "react-responsive";
// import { useDispatch, useSelector } from "react-redux";
// import { commonActions } from "reducers/common";
// import { changeLanguage } from "utils/useChangeLanguage";
// import ClickAwayListener from '@mui/material/ClickAwayListener';

const Header = () => {
    // const isMobile = useMediaQuery({ query: "(max-width: 480px)" });
    // const [showLang, setShowLang] = useState(false);
    // const [anchorEl, setAnchorEl] = useState(null);
    // const [placement, setPlacement] = useState();

    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
    const currentLang = useAppSelector((state) => state.common.currentLang);

    // const onClickShowTooltip = (newPlacement, myPage) => (e) => {
    //     setShowLang(prev => !prev);
    //     setAnchorEl(e.currentTarget);
    //     setPlacement(newPlacement)
    // };
    // const handleTooltipClose = (myPage) => {
    //     setShowLang(false);
    // };
    return (
        <div className={`${styles.headerWrap}`}>
            <header>
                <h1 className={styles.logo}>
                    <Link to={mainUrl}>
                        <img src={logo} alt={"logo"} className={styles.logoImg}/>
                        <img src={currentLang === "KOR" ? ticketKor : ticketEng} alt={"티켓"} className={styles.logoTicket}/>
                    </Link>
                </h1>
                <nav>
                    <ul className={`gnb ${styles.gnb}`}>
                        <li className={styles.myPageIcon}>
                            <NavLink to={isLoggedIn ? myPageUrl : loginUrl} />
                        </li>
                        {/*<li>*/}
                        {/*    <ClickAwayListener onClickAway={() => handleTooltipClose()}>*/}
                        {/*        <div style={{ width: "100%", height: "100%" }}>*/}
                        {/*            <button type="button" onClick={onClickShowTooltip("bottom", false)}*/}
                        {/*                    className={`${styles.lngBtn} ${showLang ? styles.active : ''}`}>*/}
                        {/*                {!isMobile && (*/}
                        {/*                    currentLang === "KOR" ? "한국어" : "English"*/}
                        {/*                )} <span />*/}
                        {/*            </button>*/}
                        {/*            <Tooltip*/}
                        {/*                open={showLang}*/}
                        {/*                anchorEl={anchorEl}*/}
                        {/*                placement={placement}*/}
                        {/*                className={styles.toolTipContainer}*/}
                        {/*            >*/}
                        {/*                <button onClick={() => changeLanguage('ko-KR', dispatch)} type={"button"}*/}
                        {/*                        style={{color: currentLang === "KOR" ? '#222' : null}}>*/}
                        {/*                    한국어*/}
                        {/*                </button>*/}
                        {/*                <button onClick={() => changeLanguage('en-US', dispatch)} type={"button"}*/}
                        {/*                        style={{color: currentLang === "ENG" ? '#222' : null}}>*/}
                        {/*                    English*/}
                        {/*                </button>*/}
                        {/*            </Tooltip>*/}
                        {/*        </div>*/}
                        {/*    </ClickAwayListener>*/}
                        {/*</li>*/}
                    </ul>
                </nav>
            </header>
            {/*{!error && <SubNav isTablet={isTablet} isPc={isPc} isMobile={isMobile} t={t}/>}*/}
        </div>
    );
};

export default Header;