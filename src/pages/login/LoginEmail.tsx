import React, { useRef, useState, MouseEvent } from 'react';
import styles from "../../styles/Sign.module.css";
import { useHistory } from "react-router-dom";
import { emailRegex } from "config/regexConfig";
import { blankValidation } from "utils/useValidation";
import { onChangeInput } from "utils/useOnChange";
import changePasswordType from "utils/useChangePasswordType";
import returnFalse from "utils/useReturnFalse";
import { useMediaQuery } from "react-responsive";
import { useCookies } from "react-cookie";
import { useAppSelector } from "reducers/hooks";
import { loginServiceEmail } from "../../service/AuthService";

const LoginEmail = () => {
    const history = useHistory();
    const isPc = useMediaQuery({ query: "(min-width: 1080px)" });
    const loginRootFrom = useAppSelector(((state) => state.auth.loginRootFrom));
    const [, setCookieUser] = useCookies(['user']);
    const [, setCookieToken] = useCookies(['token']);
    const [passwordType, setPasswordType] = useState({type: 'password', visible: false,});
    const [focusPw, setFocusPw] = useState(false);
    const [input, setInput] = useState({
        emailLogin: "",
        password: "",
    })
    const { emailLogin, password } = input;
    const emailLoginRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    let sha1 = require('sha1');

    const validation = () => {
        return (
            blankValidation(emailLoginRef?.current, null) && blankValidation(passwordRef?.current, null) &&
            emailRegex.test(emailLogin)
        );
    }

    const onSubmit = (e: MouseEvent) => {
        e.preventDefault();
        let newPassword = password.replace(/ /g, '');
        const data = {
            "authType": "EMAIL",
            "email": emailLogin,
            "encodedPassword": sha1(newPassword)
        }
        loginServiceEmail(
            {data : data, history : history, setFocusFw : setFocusPw, loginRootFrom : loginRootFrom, input : input, setInput : setInput, isPc : isPc, setCookieUser : setCookieUser, setCookieToken : setCookieToken}
        );
    }
    return (
        <form onSubmit={(e) => returnFalse(e)}>
            <div className={`${styles.formInput}`}>
                <label>이메일 아이디</label>
                <input
                    type={"text"}
                    name={"emailLogin"}
                    onChange={(e) => onChangeInput(e, input, setInput)}
                    ref={emailLoginRef}
                    required
                />
                {blankValidation(emailLoginRef?.current, null) && !emailRegex.test(emailLogin) && <span className={"spanInvalid"}>이메일 형식을 확인해주세요.</span> }
            </div>
            <div className={`${styles.formInput} ${styles.passwordInput}`}>
                <label>비밀번호</label>
                <div className={styles.passwordContainer}>
                    <input
                        type={passwordType.type}
                        name={"password"}
                        onChange={(e) => onChangeInput(e, input, setInput)}
                        ref={passwordRef}
                        required
                    />
                    <button
                        className={`${styles.passwordBtn} ${passwordType.visible ? styles.passwordBtnVisible : ''}`}
                        type={"button"}
                        onClick={() => changePasswordType(passwordType, setPasswordType)}
                     />
                </div>
                {passwordRef.current && passwordRef.current.value.length === 0 && focusPw && <span className={"spanInvalid"}>계정 정보를 다시 확인해주세요.</span> }
            </div>
            <button
                type="button"
                onClick={(e) => onSubmit(e)}
                disabled={!validation()}
                className={`${styles.formSubmit} ${validation() ? styles.active : ''}`}
            >
                로그인
            </button>
        </form>
    );
};

export default LoginEmail;