import React from 'react';
import styles from '../../styles/Sign.module.css';
import { Link, NavLink } from "react-router-dom";
import LoginFormEmail from "./LoginEmail";
import LoginSns from "./LoginSns";
import { findPasswordUrl } from "config/urlConfig";

const Login = () => {
    return (
        <div className={`${styles.login} `}>
            <h1>시작하기</h1>
            <h3>다양한 시선으로 나누는 전시 이야기</h3>
            <LoginFormEmail />
            <NavLink className={styles.registerBtn} to={"/register"}>회원가입</NavLink>
            <div className={styles.findAccount}>
                비밀번호를 잊으셨나요? <Link to={findPasswordUrl}><strong>비밀번호 찾기</strong></Link>
            </div>
            <LoginSns />
        </div>
    );
};

export default Login;