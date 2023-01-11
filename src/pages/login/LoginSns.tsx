import React from 'react';
import styles from "../../styles/Sign.module.css";

const LoginSns = () => {
    const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
    const kakao_id = process.env.REACT_APP_KAKAO_CLIENT_ID;
    const facebook_id = process.env.REACT_APP_FACEBOOK_CLIENT_ID;
    const apple_id = process.env.REACT_APP_APPLE_CLIENT_ID;

    const loginByKakao = () => {
        const url = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao_id}&redirect_uri=${redirect_uri}&response_type=code`;
        getCode(url, 'KAKAO');
    }
    const loginByFacebook = () => {
        const url = `https://www.facebook.com/v15.0/dialog/oauth?client_id=${facebook_id}&redirect_uri=${redirect_uri}&state=abcd&scope=email`;
        getCode(url, 'FACEBOOK');
    }
    // const loginByApple = () => {
    //     const url = `https://appleid.apple.com/auth/authorize?client_id=${apple_id}&redirect_uri=${redirect_uri}&response_type=code`;
    //     getCode(url, 'APPLE');
    // }
    const getCode = (url, authType) => {
        window.open(url, "_self");
        localStorage.setItem('authType', authType);
    }
    return (
        <>
        <div className={styles.emptyContainer}>
            <span className={styles.line} />
            <span>SNS 계정으로 로그인</span>
            <span className={styles.line} />
        </div>
        <div className={styles.snsContainer}>
            <button onClick={loginByFacebook} className={styles.facebook} type={"button"} />
            <button onClick={loginByKakao} className={styles.kakao} type={"button"} />
            {/*<button onClick={loginByApple} className={styles.apple} type={"button"} />*/}
        </div>
        </>
    );
};

export default LoginSns;