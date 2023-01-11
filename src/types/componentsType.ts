export type placeholderImageType = {
    placeholderSrc: string;
    src: string;
    alt: string;
}
export type tabPanelType = {
    children: JSX.Element;
    value: number;
    index: number;
}
export type loadingType = {
    custom: boolean;
    text: string;
};
export type passwordChangeModalType = {
    openPopup: boolean,
    setOpenPopup: any
}
export type VerificationModalType = {
    openPopup: boolean,
    setOpenPopup: any
}
export type VerificationModalInputsType = {
    name: string,
    phoneNumber: string,
    verificationCode: string,
}