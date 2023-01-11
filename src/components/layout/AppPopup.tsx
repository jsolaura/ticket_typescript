import React from 'react';
import { useCookies } from "react-cookie";

const AppPopup = () => {
    const [cookie, setCookie] = useCookies(['appPopup']);
    const onTouchStart = () => {
        let userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf('android') > -1) {
            window.open('https://play.google.com/store/apps/details?id=com.peopulley.qpicker.android&hl=ko&gl=US')
            onSkip();
        } else if (userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipad') > -1 || userAgent.indexOf('ipod') > -1) {
            window.open('https://apps.apple.com/kr/app/%ED%81%90%ED%94%BC%EC%BB%A4-qpicker-%ED%95%9C%EA%B5%AD%EC%96%B4-%EC%98%A4%EB%94%94%EC%98%A4-%EA%B0%80%EC%9D%B4%EB%93%9C/id1469376668')
            onSkip();
        }
    }
    const onSkip = () => {
        setCookie('appPopup', 'true', { path: '/', })
    }
    return (
        <div className={`appPopupWrap ${cookie.appPopup ? 'hide' : ''}`}>
            <div className={"dimmed"} />
            <section className={"appPopup"}>
                <label>
                    <p className={"appLogo"} />
                    <p className={"appTitle"}>
                        QPICKER
                        <span>전세계 어디서나 오디오가이드</span>
                    </p>
                </label>
                <p className={"appInfo"}>
                    ⭐⭐ 전시 좋아하는 사람이라면 큐피커! ⭐⭐
                </p>
                <button onClick={() => onTouchStart} className={"positiveBtn popBtn"}>큐피커 앱 설치하기</button>
                <button onClick={() => onSkip} className={"negativeBtn"}>다시보지 않기</button>
            </section>
        </div>
    );
};

export default AppPopup;