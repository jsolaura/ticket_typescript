import React from 'react';
import styles from "../../styles/Footer.module.css";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div className={styles.footerWrap}>
            <div className={styles.footerNotice}>
                <p>큐피커에서 제공하는 모든 콘텐츠의 저작권은 창작자 또는 제공업체에 있으며, 무단 전재 및 재배포 시 저작권 법에 따라 법적 책임을 물을 수 있습니다.</p>
            </div>
            <footer>
                <ul className={styles.footerInfo}>
                    <li>
                        <Link to={"/customerService"}>고객센터</Link>
                        <button onClick={() => {window.open('/faq/policy/TermsOfService', '_blank')}}>이용약관</button>
                        <button onClick={() => {window.open('/faq/policy/PrivacyPolicy', '_blank')}}>
                            <strong>개인정보처리방침</strong>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => window.open('https://www.qpicker.com/about')}>큐피커 앱 다운로드</button>
                        <span>이메일 무단수집거부</span>
                    </li>
                </ul>
                <ul className={styles.footerAcc}>
                    <li>상호명: (주)피플리</li>
                    <li>대표자: 이민재</li>
                    <li>개인정보보호책임자: 정태문</li>
                    <li>사업자등록번호: 890-86-00557</li>
                    <li>통신판매업신고: 2019-서울마포-0295호</li>
                    <li>서울특별시 마포구 서강로1길 12-9, 2층</li>
                    <li>대표이메일: support@peopulley.com</li>
                </ul>
                <span className={styles.copyright}>Copyright ⓒ peopulley Inc. All rights reserved.</span>
                <div className={styles.footerSns}>
                    <a target={"_blank"} rel="noreferrer" href={"https://www.instagram.com/qpicker/"} className={styles.insta}> </a>
                    <a target={"_blank"} rel="noreferrer" href={"https://www.youtube.com/channel/UC7t7AkvgfAGrk6aMfLuYJEA?app=desktop"} className={styles.youtube}> </a>
                </div>
            </footer>
        </div>
    );
};

export default Footer;