import React, { useRef, useState } from 'react';
import styles from '../../styles/Service.module.css';
import { emailRegex, numberRegex } from "config/regexConfig";
import { useMediaQuery } from "react-responsive";
import { blankValidation } from "utils/useValidation";
import { onChangeInput } from "utils/useOnChange";
import returnFalse from "utils/useReturnFalse";
import { postSubmitCs } from "../../service/CustomerService";

const Inquiry = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 480px)" })
    const [input, setInput] = useState({
        userName: "",
        userEmail: "",
        userNumber: "",
        content: "",
    })
    let { userName, userEmail, userNumber, content } = input;
    const inputRef = useRef<any[]>([]);

    const validation = () => {
        return (
            emailRegex.test(userEmail) && numberRegex.test(userNumber) &&
            userName.length >= 2 && content.length >= 2 && 10 <= userNumber.length && userNumber.length <= 12
        );
    }
    const onSubmit = (e) => {
        e.preventDefault();
        let data = {
            "customerName" : userName,
            "customerEmail" : userEmail,
            "phoneNumber" : userNumber,
            "inquiry" : content
        }
        postSubmitCs(data, setInput);
    }
    return (
        <div className={styles.inquiryWrap}>
            <h2>문의 사항이 있으신가요?</h2>
            <h5 className={"brElement"}>아래 양식을 작성해주세요. {isMobile ? `\n` : ""}최대한 빠르게 답변 드리겠습니다.</h5>
            <form onSubmit={(e) => returnFalse(e)}>
                <label className={styles.formInput}>
                    <span>성함</span>
                    <div>
                        <input
                            type={"text"}
                            placeholder={"큐피커"}
                            name={"userName"}
                            value={userName}
                            onChange={(e) => onChangeInput(e, input, setInput)}
                            minLength={1}
                            ref={el => (inputRef.current[0] = el)}
                            required
                        />
                    </div>
                </label>
                <label className={styles.formInput}>
                    <span>답변 받으실 이메일 주소</span>
                    <div>
                        <input
                            type={"text"}
                            placeholder={"abc@example.com"}
                            name={"userEmail"}
                            value={userEmail}
                            onChange={(e) => onChangeInput(e, input, setInput)}
                            ref={el => (inputRef.current[1] = el)}
                            required
                        />
                        <span className={`${userEmail !== "" && blankValidation(inputRef.current[1], null) && !emailRegex.test(userEmail) ? "spanInvalid" : "caption"} ${styles.spanMsg}`}>이메일 형식을 확인해주세요.</span>
                    </div>
                </label>
                <label className={styles.formInput}>
                    <span>연락처</span>
                    <div>
                        <input
                            type={"text"}
                            placeholder={"01000000000"}
                            name={"userNumber"}
                            value={userNumber}
                            minLength={10}
                            maxLength={12}
                            onChange={(e) => onChangeInput(e, input, setInput)}
                            ref={el => (inputRef.current[2] = el)}
                            required
                        />
                        <span className={`${userNumber !== "" && blankValidation(inputRef.current[2], null) && !numberRegex.test(userNumber) ? "spanInvalid" : "caption"} ${styles.spanMsg}`}>*  숫자만 입력해주세요.</span>
                    </div>
                </label>
                <label className={`${styles.formInput} ${styles.formTextarea}`}>
                    <span>문의사항</span>
                    <div>
                        <textarea
                            placeholder={"문의 사항을 남겨주세요."}
                            name={"content"}
                            value={content}
                            minLength={1}
                            onChange={(e) => onChangeInput(e, input, setInput)}
                            ref={el => (inputRef.current[3] = el)}
                            required
                        />
                    </div>
                </label>
                <span className={styles.line} />
                <button onClick={(e) => onSubmit(e)} disabled={!validation()} className={`btn ${styles.submitBtn}`}>제출하기</button>
            </form>
        </div>
    );
};

export default Inquiry;