import React, { useEffect, useRef, useState } from 'react';
import styles from "../../styles/Sign.module.css";
import { emailRegex, passwordRegex } from "config/regexConfig";
import { useMediaQuery } from "react-responsive";
import { authAction } from "reducers/auth";
import { resetTimer, startTimer } from "utils/useControlTimer";
import { useHistory } from "react-router-dom";
import { blankValidation, sameCheckValidation } from "utils/useValidation";
import { onChangeInput } from "utils/useOnChange";
import durationFormat from "utils/useDurationFormat";
import changePasswordType from "../../utils/useChangePasswordType";
import {useAppDispatch, useAppSelector} from "reducers/hooks";
import returnFalse from "utils/useReturnFalse";
import { checkEmailVerifService, postEmailVerifService } from "../../service/AuthService";
import { registerFormType } from "../../types/authType";


const RegisterForm = ({ input, setInput, passwordType, passwordConfirmType, setPasswordType, setPasswordConfirmType }: registerFormType) => {
    const isMobile = useMediaQuery({query: "(max-width: 480px)"});
    const timerCount = useAppSelector((state) => state.common.timerCount);
    const timerActive = useAppSelector((state) => state.common.timerActive);
    const verifiCode = useAppSelector((state) => state.auth.verificationCode);
    const successVerification = useAppSelector((state) => state.auth.successVerification);
    const history = useHistory();
    const emailRef = useRef<HTMLInputElement>(null);
    const emailCheckRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordCheckRef = useRef<HTMLInputElement>(null);
    const verificationCodeRef = useRef<HTMLInputElement>(null);
    const [disabled, setDisabled] = useState(false);
    let { email, emailCheck, verificationCode, password } = input;
    const dispatch = useAppDispatch();

    useEffect(() => {
        let timerId = setInterval(() => startTimer(timerCount, timerActive), 1000);
        return () => clearInterval(timerId);
    })
    useEffect(() => {
        if (verifiCode) {
            let redo = setTimeout(() => {
                setDisabled(false);
            }, 30000);
            return () => {
                clearTimeout(redo)
            };
        }
    }, [verifiCode])
    useEffect(() => {
        if (timerCount <= 0) {
            resetTimer();
            dispatch(authAction.setVerificationCode(true));
        }
    }, [timerCount])

    const getVerificationCode = (e: MouseEvent) => {
        e.preventDefault();
        setDisabled(true);
        postEmailVerifService(email, history, isMobile, verifiCode, timerActive);
    }
    const checkVerificationCode = (e: MouseEvent) => {
        e.preventDefault();
        checkEmailVerifService(email, verificationCode, input, setInput);
    }
    return (
        <>
            <div className={styles.formInput}>
                <label>이메일 주소</label>
                <div className={styles.emailContainer}>
                    <input
                        type={"text"}
                        disabled={successVerification}
                        value={email}
                        name={"email"}
                        ref={emailRef}
                        required
                        onChange={(e) => onChangeInput(e, input, setInput)}
                    />
                </div>
                {blankValidation(emailRef?.current, null) && !emailRegex.test(email)
                    ? <span className={"spanInvalid"}>이메일 형식을 확인해주세요.</span>
                    : <span className={"caption brElement"}>* 입력하신 이메일로 인증번호가 발송됩니다. 정확한 이메일을 입력해주세요.</span>
                }
            </div>
            <div className={styles.formInput}>
                <label>이메일 주소 확인</label>
                <div className={styles.emailContainer}>
                    <input
                        type={"text"}
                        disabled={successVerification}
                        onCopy={() => returnFalse}
                        onPaste={() => returnFalse}
                        onCut={() => returnFalse}
                        className={styles.emailCheckInput}
                        value={emailCheck}
                        name={"emailCheck"}
                        ref={emailCheckRef}
                        required
                        onChange={(e) => onChangeInput(e, input, setInput)}
                    />
                    <button
                        onClick={() => getVerificationCode}
                        disabled={
                            emailCheckRef?.current?.value === "" || !emailRegex.test(email)
                                ? !verifiCode
                                    ? !disabled
                                    : sameCheckValidation(
                                        emailRef?.current ? emailRef?.current.value : null,
                                        emailCheckRef?.current ? emailCheckRef?.current.value : null
                                    ) || successVerification || disabled
                                : disabled
                        }
                        className={`${styles.authBtn} ${successVerification ? styles.success : ""}`}
                    >
                        {successVerification ? "인증 완료" : verifiCode ? "재전송" : "인증번호 전송"}
                    </button>
                </div>
                {blankValidation(emailCheckRef?.current, null)
                && sameCheckValidation(
                    emailRef?.current ? emailRef?.current.value : null,
                    emailCheckRef?.current ? emailCheckRef?.current.value : null)
                &&
                    <span className={"spanInvalid"}>위 이메일 주소와 일치하지 않습니다.</span>
                }
                {verifiCode && !successVerification &&
                    <span className={"spanCorrect"}>인증번호가 발송됐습니다. 이메일 확인 후 인증번호를 입력해주세요.  </span>}
            </div>
            <div className={styles.formInput}>
                <label>이메일 인증 코드</label>
                <div className={styles.emailContainer}>
                    <input
                        type={"number"}
                        disabled={successVerification}
                        onCopy={returnFalse}
                        onPaste={returnFalse}
                        onCut={returnFalse}
                        className={styles.emailCheckInput}
                        name={"verificationCode"}
                        maxLength={10}
                        ref={verificationCodeRef}
                        required
                        onChange={(e) => onChangeInput(e, input, setInput)}
                    />
                    <button
                        onClick={() => checkVerificationCode}
                        type={"button"}
                        disabled={
                            successVerification
                            || verificationCodeRef?.current?.value === ""
                            || !verifiCode
                        }
                        className={`${styles.authBtn} ${successVerification ? styles.success : ""}`}
                    >
                        {successVerification ? '인증 완료' : '인증코드 확인'}
                    </button>
                </div>
                {timerActive &&
                    <span className={"spanCorrect"} style={{marginTop: '5px'}}>남은시간 {durationFormat(timerCount)}</span>}
            </div>
            <div className={styles.formInput}>
                <div className={styles.passwordInput}>
                    <label>비밀번호</label>
                    <div className={styles.passwordContainer}>
                        <input
                            name={"password"}
                            type={passwordType.type}
                            ref={passwordRef}
                            required
                            onChange={(e) => onChangeInput(e, input, setInput)}
                        />
                        <button
                            className={`${styles.passwordBtn} ${passwordType.visible ? `${styles.passwordBtnVisible}` : ''}`}
                            type={"button"}
                            onClick={() => changePasswordType(passwordType, setPasswordType)}
                        />
                    </div>
                </div>
                {blankValidation(passwordRef.current, null) && !passwordRegex.test(password)
                    ? <span className={"spanInvalid"}>비밀번호 필수 조건 : 영문자, 숫자, 특수문자 포함 8자 이상</span>
                    : <span className={"caption"}>* 8~20자리 영문, 숫자, 특수기호를 조합해 입력해주세요.</span>
                }
            </div>
            <div className={styles.formInput}>
                <div className={styles.passwordInput}>
                    <label>비밀번호 확인</label>
                    <div className={styles.passwordContainer}>
                        <input
                            type={passwordConfirmType.type}
                            name={"passwordCheck"}
                            ref={passwordCheckRef}
                            required
                            onChange={(e) => onChangeInput(e, input, setInput)}
                        />
                        <button
                            className={`${styles.passwordBtn} ${passwordConfirmType.visible ? `${styles.passwordBtnVisible}` : ''}`}
                            type={"button"}
                            onClick={() => changePasswordType(passwordConfirmType, setPasswordConfirmType)}
                        />
                    </div>
                </div>
                { blankValidation(passwordCheckRef?.current, null)
                    ? sameCheckValidation(
                        passwordRef?.current ? passwordRef?.current.value : null,
                        passwordCheckRef?.current ? passwordCheckRef?.current.value : null
                    )
                        ? <span className={"spanInvalid"}>위 비밀번호와 일치하지 않습니다.</span>
                        : <span className={"spanCorrect"}>비밀번호가 일치합니다.</span>
                    : null
                }
            </div>
        </>
    );
};

export default RegisterForm;