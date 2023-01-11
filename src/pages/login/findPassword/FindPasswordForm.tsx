import React, { useRef, useState, MouseEvent } from 'react';
import styles from "../../../styles/Sign.module.css";
import { withNamespaces } from "react-i18next";
import { useHistory } from "react-router-dom";
import { emailRegex } from "config/regexConfig";
import { blankValidation, sameCheckValidation } from "utils/useValidation";
import { onChangeInput } from "utils/useOnChange";
import returnFalse from "utils/useReturnFalse";
import { findPasswordService } from "../../../service/AuthService";

const FindPasswordForm = () => {
    const [input, setInput] = useState({
        email: "",
        emailCheckPassword: "",
    })
    let { email, emailCheckPassword } = input;
    const emailRef = useRef<HTMLInputElement>(null);
    const emailCheckPwRef = useRef<HTMLInputElement>(null);
    const history = useHistory();

    const validation = () => {
        return (
            !blankValidation(null, [email, emailCheckPassword]) &&
            !sameCheckValidation(email, emailCheckPassword) && emailRegex.test(email)
        );
    }

    const onSubmit = (e: MouseEvent): void=> {
        e.preventDefault();
        findPasswordService(email, history);
    }

    return (
        <form onSubmit={(e) => returnFalse(e)}>
            <div className={`${styles.formInput}`}>
                <label>가입한 이메일 주소</label>
                <input
                    type={"text"}
                    name={"email"}
                    ref={emailRef}
                    onChange={(e) => onChangeInput(e, input, setInput)}
                    required
                />
                { blankValidation(emailRef?.current, null) && !emailRegex.test(email) && <span className={"spanInvalid"}>이메일 형식을 확인해주세요.</span> }
            </div>
            <div className={`${styles.formInput} ${styles.passwordInput}`}>
                <label>이메일 주소 확인</label>
                <div className={styles.passwordContainer}>
                    <input
                        type={"text"}
                        onCopy={returnFalse}
                        onPaste={returnFalse}
                        onCut={returnFalse}
                        name={"emailCheckPassword"}
                        ref={emailCheckPwRef}
                        onChange={(e) => onChangeInput(e, input, setInput)}
                        required
                    />
                </div>
                { blankValidation(emailCheckPwRef?.current, null)
                    && sameCheckValidation(
                        emailRef?.current ? emailRef?.current.value : null,
                        emailCheckPwRef?.current ? emailCheckPwRef?.current.value : null
                    ) && <span className={"spanInvalid"}>위 이메일 주소와 일치하지 않습니다.</span>
                }
            </div>
            <button
                onClick={(e) => onSubmit(e)}
                type="button"
                disabled={!validation()}
                className={`${styles.formSubmit} ${validation() ? styles.active : ''}`}
            >
                비밀번호 찾기
            </button>
        </form>
    );
};

export default withNamespaces('common')(FindPasswordForm);