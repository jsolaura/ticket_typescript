import React, { ChangeEvent, useEffect, useState } from 'react';
import styles from "../../styles/MyPage.module.css";
import VerificationModal from "components/modal/VerificationModal";
import PasswordChangeModal from "components/modal/PasswordChangeModal";
import { useHistory } from "react-router-dom";
import { resetTimer, startTimer } from "utils/useControlTimer";
import { ticketAction } from "reducers/ticket";
import { useCookies } from "react-cookie";
import { useAppDispatch, useAppSelector } from "reducers/hooks";
import { deleteUserService, logoutService } from "../../service/AuthService";
import { changeUserName } from "../../service/MyPageService";

const Account = () => {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const phoneNumber = useAppSelector((state) => state.auth.userPhoneNumber);
    const timerCount = useAppSelector((state) => state.common.timerCount);
    const timerActive = useAppSelector((state) => state.common.timerActive);

    const [, setCookieUser] = useCookies(['user']);

    const [openVerifiPopup, setOpenVerifiPopup] = useState(false);
    const [openPwChangePopup, setOpenPwChangePopup] = useState(false);
    const clickOpenVerifiPopup = () => setOpenVerifiPopup(true);
    const clickOpenPwChangePopup = () => setOpenPwChangePopup(true);

    const [userName, setUserName] = useState(user?.name);
    const onChangeUserName = (e: ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
    }
    useEffect(() => {
        let timerId = setInterval(() => startTimer(timerCount, timerActive), 1000);
        return () => clearInterval(timerId);
    });
    useEffect(() => {
        if (timerCount <= 0) {
            resetTimer();
            dispatch(ticketAction.checkVerification(false));
        }
    }, [timerCount]);
    const logout = () => {
        console.log("!??")
        logoutService(history);
    }
    const deleteUser = () => {
        deleteUserService(history);
    }
    const editName = () => {
        changeUserName(userName, setCookieUser);
    }
    return (
        <>
        <article className={styles.myAccount}>
            <h3>내 계정 <button onClick={() => logout()} type={"button"} className={`underLine`}>로그아웃</button></h3>
            <div>
                <span>이름</span>
                <label>
                    <input onChange={(e) => onChangeUserName(e)} defaultValue={user?.name} type={"text"} name={"name"} />
                    <button onClick={() => editName()} type={"button"} className={styles.myBtn}>변경 사항 저장</button>
                </label>
            </div>
            <div className={styles.accountLabel}>
                <span>가입 계정</span>
                <input defaultValue={user?.authType === "EMAIL" ? user?.email : user?.authType} type={"text"} disabled />
            </div>
            {user?.authType === "EMAIL" && user?.emailVerified &&
            <div>
                <span>이메일</span>
                <label>
                    <input defaultValue={user?.email} type={"text"} disabled />
                    <button className={styles.myBtn} disabled>인증완료</button>
                </label>
            </div>
            }
            <div>
                <span>휴대폰 번호</span>
                <label>
                    <input defaultValue={user?.cellPhoneVerified ? phoneNumber : "인증 정보 없음"} type={"text"} disabled />
                    <button onClick={clickOpenVerifiPopup} className={styles.myBtn}>{user?.cellPhoneVerified && phoneNumber ? "재인증" : "인증하기"}</button>
                </label>
            </div>
            <div className={styles.manageAccount}>
                {user?.authType === "EMAIL" && <button onClick={clickOpenPwChangePopup}>비밀번호 변경</button>}
                <button onClick={() => deleteUser()} type={"button"}>회원 탈퇴</button>
            </div>
        </article>
        <VerificationModal openPopup={openVerifiPopup} setOpenPopup={setOpenVerifiPopup} />
        <PasswordChangeModal openPopup={openPwChangePopup} setOpenPopup={setOpenPwChangePopup}  />
        </>
    );
};

export default Account;