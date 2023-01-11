import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
import './modal.css';
import Modal from "@mui/material/Modal";
import AlertBasic from "../display/AlertBasic";
import { numberRegex } from "config/regexConfig";
import { commonAction } from "reducers/common";
import { ticketAction } from "reducers/ticket";
import { authAction } from "reducers/auth";
import { onChangeInput } from "utils/useOnChange";
import returnFalse from "utils/useReturnFalse";
import durationFormat from "utils/useDurationFormat";
import {useAppDispatch, useAppSelector} from "reducers/hooks";
import { checkVerificationCodeService, postVerificationCodeService } from "../../service/CommonService";
import {VerificationModalInputsType, VerificationModalType} from "../../types/componentsType";


const VerificationModal = ({ openPopup, setOpenPopup }: VerificationModalType) => {
    const postVerificationCode = useAppSelector((state) => state.ticket.postVerificationCode);
    const checkedPhoneNumber = useAppSelector((state) => state.auth.userPhoneNumber);
    const timerCount = useAppSelector((state) => state.common.timerCount);
    const timerActive = useAppSelector((state) => state.common.timerActive);
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    const [disabled, setDisabled] = useState(false);
    const [input, setInput] = useState<VerificationModalInputsType>({
        name: user ? user?.name : "",
        phoneNumber: "",
        verificationCode: "",
    });
    const { name, phoneNumber, verificationCode } = input;

    useEffect(() => {
        if (postVerificationCode) {
            let redo = setTimeout(() => setDisabled(true), 30000);
            return () => clearTimeout(redo);
        }
    }, [postVerificationCode])
    useEffect(() => {
        if (user?.cellPhoneVerified === false) {
            dispatch(authAction.setUserPhoneNumber(''));
        }
    }, [user])

    const clickClosePopup = (event: any, reason: any) => {
        if (reason && reason === "backdropClick") return;
        setOpenPopup(false);
        AlertBasic('인증이 취소되었습니다.', () => {
            setInput({
                name: user ? user?.name : "",
                phoneNumber: "",
                verificationCode: "",
            });
            dispatch(ticketAction.postVerification(false));
            dispatch(commonAction.setTimerActive(false));
        })
    };
    const getVerificationCode = useCallback((e: ChangeEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setDisabled(false);
        if (!checkedPhoneNumber) postVerificationCodeService(phoneNumber, name, setOpenPopup, input, setInput, false);
            else postVerificationCodeService(phoneNumber, name, setOpenPopup, input, setInput, true);
    }, [name, phoneNumber]);

    const chkVerificationCode = useCallback((e: ChangeEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!checkedPhoneNumber) checkVerificationCodeService(input.verificationCode, input.phoneNumber, setOpenPopup, input, setInput,false);
            else checkVerificationCodeService(input.verificationCode, input.phoneNumber, setOpenPopup, input, setInput, true);
    }, [verificationCode]);

    return (
        <Modal
            open={openPopup}
            onClose={() => clickClosePopup}
        >
            <div className={`popupWrap`}>
                <div className={`popupContentWrap`}>
                    <h3>휴대폰 번호 인증</h3>
                    <form onSubmit={(e) => returnFalse(e)}>
                        {!checkedPhoneNumber &&
                            <label>
                                성함
                                <input
                                    type={"text"}
                                    placeholder={"이름"}
                                    name={"name"}
                                    defaultValue={input.name}
                                    onChange={(e) => onChangeInput(e, input, setInput)}
                                />
                            </label>
                        }
                        <div className={`phoneContainer`}>
                            휴대폰 번호
                            <label>
                                <input
                                    type={"text"}
                                    placeholder={"01000000000"}
                                    name={"phoneNumber"}
                                    defaultValue={input.phoneNumber}
                                    maxLength={11}
                                    minLength={10}
                                    onChange={(e) => onChangeInput(e, input, setInput)}
                                />
                                <button
                                    onClick={() => getVerificationCode}
                                    className={`btn`}
                                    disabled={postVerificationCode ? !disabled : input.name === "" || input.phoneNumber === "" || !numberRegex.test(input.phoneNumber) }
                                >
                                    {postVerificationCode ? "재전송" : "인증코드 전송"}
                                </button>
                            </label>
                            <span className={`${input.phoneNumber.length >= 1 &&  !numberRegex.test(input.phoneNumber) ? "spanInvalid" : "caption" }`}>*  숫자만 입력해주세요.</span>
                        </div>
                        <label>
                            인증 코드
                            <input
                                name={"verificationCode"}
                                type={"number"}
                                onChange={(e) => onChangeInput(e, input, setInput)}
                                disabled={!postVerificationCode}
                                placeholder={"인증 코드를 입력해주세요."}
                            />
                            { timerActive && <span className={"spanCorrect"} style={{ marginTop: '5px' }}>남은시간 {durationFormat(timerCount)}</span>}
                        </label>
                    </form>
                </div>
                <div className={`popupBtnWrap`}>
                    <button className={`closeBtn`} onClick={() => clickClosePopup}>취소</button>
                    <button className={`confirmBtn btn`} onClick={() => chkVerificationCode} disabled={input.verificationCode === undefined || input.verificationCode === "" || !postVerificationCode}>인증코드 확인</button>
                </div>
            </div>
        </Modal>
    );
};

export default VerificationModal;