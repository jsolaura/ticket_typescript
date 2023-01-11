import React from 'react';
import styles from "../../../styles/Sign.module.css";
import LoginSns from "../LoginSns";
import { NavLink } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import FindPasswordForm from "./FindPasswordForm";

const FindPassword = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 480px)" })
    return (
        <div className={styles.login}>
            <h1>비밀번호 찾기</h1>
            <h3>가입하신 이메일 계정으로 임시 비밀번호를 {isMobile ? <br /> : ""}전송해드립니다.</h3>
            <FindPasswordForm/>
            <NavLink className={styles.registerBtn} to={"/register"}>회원가입</NavLink>
            <LoginSns />
        </div>
    );
};

export default  FindPassword;