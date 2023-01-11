import React, { useState } from 'react';
import styles from "../../styles/Sign.module.css";
import { useHistory } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import RegisterForm from "./RegisterForm";
import Terms from "pages/register/Terms";
import returnFalse from "utils/useReturnFalse";
import { blankValidation, sameCheckValidation } from "utils/useValidation";
import { emailRegex, passwordRegex } from "config/regexConfig";
import { useCookies } from "react-cookie";
import { useAppSelector } from "reducers/hooks";
import { signInService } from "../../service/AuthService";

const Register = () => {
    const history = useHistory();
    const isMobile = useMediaQuery({ query: "(max-width: 480px)" });
    const successVerification = useAppSelector((state) => state.auth.successVerification);
    const [checkedTerms, setCheckedTerms] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [passwordType, setPasswordType] = useState({type: 'password', visible: false,})
    const [passwordConfirmType, setPasswordConfirmType] = useState({type: 'password', visible: false,})
    const [, setCookieUser] = useCookies(['user']);
    const [, setCookieToken] = useCookies(['token']);
    let sha1 = require('sha1');
    const [input, setInput] = useState({
        email: "",
        emailCheck: "",
        verificationCode: "",
        password: "",
        passwordCheck: "",
    });
    const { email, emailCheck, password, passwordCheck, verificationCode } = input;

    const validation = () => {
        return (
            !blankValidation(null, [email, emailCheck, password, passwordCheck, verificationCode]) &&
            !sameCheckValidation(email, emailCheck) &&
            !sameCheckValidation(password, passwordCheck) &&
            emailRegex.test(email) && passwordRegex.test(password) &&
            successVerification && checkedTerms.length === 2
        );
    }
    const onSubmit = (e: MouseEvent) => {
        e.preventDefault();
        let userName = email.split('@')[0];
        let data = {
            "id":null,
            "username": userName,
            "encodedPassword": sha1(password),
            "email": email,
            "platform": "Web",
            "authType": "EMAIL"
        }
        signInService(data, history, setCookieUser, setCookieToken);
    }
    return (
        <div className={`${styles.register}`}>
            <h1>회원가입</h1>
            <h3>회원가입 후, 큐피커의 다양한 서비스를 {isMobile ? <br/> : ""}이용해보실 수 있습니다.</h3>
            <form className={styles.registerForm} onSubmit={(e) => returnFalse(e)}>
                <RegisterForm
                    input={input}
                    setInput={setInput}
                    passwordType={passwordType}
                    passwordConfirmType={passwordConfirmType}
                    setPasswordType={setPasswordType}
                    setPasswordConfirmType={setPasswordConfirmType}
                />
                <Terms checkedTerms={checkedTerms} setCheckedTerms={setCheckedTerms} setIsReady={setIsReady}/>
                <button
                    disabled={!validation()}
                    onClick={() => onSubmit}
                    type={"button"}
                    className={`${styles.formSubmit} ${isReady ? styles.blockBtn : ''}`}
                >
                    회원가입
                </button>
            </form>
        </div>
    );
};

export default Register;