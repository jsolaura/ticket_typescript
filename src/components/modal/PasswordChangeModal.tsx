import React, { useRef, useState, MouseEvent } from 'react';
import './modal.css';
import Modal from "@mui/material/Modal";
import AlertBasic from "../display/AlertBasic";
import changePasswordType from "utils/useChangePasswordType";
import { passwordRegex } from "config/regexConfig";
import { onChangeInput } from "utils/useOnChange";
import returnFalse from "utils/useReturnFalse";
import { changeNewPassword, getCurrentPassword, setUpPassword } from "../../service/MyPageService";
import { passwordChangeModalType } from "../../types/componentsType";


const PasswordChangeModal = ({ openPopup, setOpenPopup }: passwordChangeModalType) => {
    let sha1 = require('sha1');
    const currentRef = useRef<HTMLInputElement>(null);
    const [currentPasswordType, setCurrentPasswordType] = useState({type: 'password', visible: false})
    const [newPasswordType, setNewPasswordType] = useState({type: 'password', visible: false})
    const [checkPasswordType, setCheckPasswordType] = useState({type: 'password', visible: false})
    const [nextStep, setNextStep] = useState(null);
    const [input, setInput] = useState({
        currentPassword: "",
        newPassword: "",
        checkPassword: "",
    });
    const clickClosePopup = (event: any, reason: any) => {
        if (reason && reason === "backdropClick") return;
        setOpenPopup(false);
        AlertBasic('비밀번호 변경이 취소되었습니다.', () => {
            setUpPassword(setInput, setNextStep, setCheckPasswordType, setNewPasswordType, setCurrentPasswordType);
        })
    };
    const checkCurrentPassword = (e: MouseEvent) => {
        e.preventDefault();
        let newPassword = input.currentPassword.replace(/ /g, '');
        let currentPw = sha1(newPassword);
        getCurrentPassword(currentPw, setNextStep, input, setInput,() => {
            setInput({
                currentPassword: "",
                newPassword: "",
                checkPassword: ""
            });
            currentRef.current && currentRef.current.focus();
        });
    }
    const changePassword = (e: MouseEvent) => {
        e.preventDefault();
        let newPassword = input.checkPassword.replace(/ /g, '');
        let newPw = sha1(newPassword);
        changeNewPassword(newPw, setOpenPopup, setNextStep, () => {
            setUpPassword(setInput, setNextStep, setCheckPasswordType, setNewPasswordType, setCurrentPasswordType);
        });
    }
    return (
        <Modal
            open={openPopup}
            onClose={() => clickClosePopup}
        >
            <div className={`popupWrap`}>
                <div className={`popupContentWrap changePwWrap`}>
                    <h3>비밀번호 변경</h3>
                    <form onSubmit={(e) => returnFalse(e)}>
                        {!nextStep  &&
                            <label>
                                <span>기존 비밀번호</span>
                                <div className={"passwordContainer"}>
                                    <input
                                        ref={currentRef}
                                        type={currentPasswordType.type}
                                        value={input.currentPassword}
                                        name={"currentPassword"}
                                        onChange={(e) => onChangeInput(e, input, setInput)}
                                    />
                                    <button
                                        className={`passwordBtn ${currentPasswordType.visible ? `passwordBtnVisible` : ''}`}
                                        type={"button"}
                                        onClick={() => changePasswordType(currentPasswordType, setCurrentPasswordType)}
                                    />
                                </div>
                                {nextStep === false && <em className={"spanInvalid"}>비밀번호가 맞지 않습니다.</em> }
                            </label>
                        }
                        {nextStep &&
                            <>
                                <label className={`phoneContainer`}>
                                    <span>새 비밀번호</span>
                                    <div className={"passwordContainer"}>
                                        <input
                                            type={newPasswordType.type}
                                            name={"newPassword"}
                                            onChange={(e) => onChangeInput(e, input, setInput)}
                                        />
                                        <button
                                            className={`passwordBtn ${newPasswordType.visible ? `passwordBtnVisible` : ''}`}
                                            type={"button"}
                                            onClick={() => changePasswordType(newPasswordType, setNewPasswordType)}
                                        />
                                    </div>
                                    <em className={`${input.newPassword !== "" && !passwordRegex.test(input.newPassword) ? 'spanInvalid' : 'caption'}`}>비밀번호 필수 조건 : 영문자, 숫자, 특수문자 포함 8자 이상</em>
                                </label>
                                <label>
                                    <span>새 비밀번호 확인</span>
                                    <div className={"passwordContainer"}>
                                        <input
                                            type={checkPasswordType.type}
                                            name={"checkPassword"}
                                            onChange={(e) => onChangeInput(e, input, setInput)}
                                        />
                                        <button
                                            className={`passwordBtn ${checkPasswordType.visible ? `passwordBtnVisible` : ''}`}
                                            type={"button"}
                                            onClick={() => changePasswordType(checkPasswordType, setCheckPasswordType)}
                                        />
                                    </div>
                                    {input.checkPassword !== "" && input.checkPassword !== input.newPassword && <em className={`spanInvalid`}>위 비밀번호와 일치하지 않습니다.</em>}
                                </label>
                            </>
                        }
                    </form>
                </div>
                <div className={`popupBtnWrap`}>
                    <button className={`closeBtn`} onClick={() => clickClosePopup}>취소</button>
                    {!nextStep
                        ? <button type={"button"} onClick={(e) => checkCurrentPassword(e)} className={`confirmBtn btn`} disabled={input.currentPassword === undefined || input.currentPassword === ""}>확인</button>
                        : <button type={"button"} onClick={(e) => changePassword(e)} className={`confirmBtn btn`} disabled={input.checkPassword === "" || input.newPassword !==  input.checkPassword || !passwordRegex.test(input.newPassword) || !passwordRegex.test(input.checkPassword)}>확인</button>
                    }
                </div>
            </div>
        </Modal>
    );
};

export default PasswordChangeModal;