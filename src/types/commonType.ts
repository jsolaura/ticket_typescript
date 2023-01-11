export type noticeCategoryType = {
    id: number,
    name: string,
    color: string,
    createdAt: string,
    updatedAt: string,
}

export type noticeDataType = {
    content: string,
    createdAt: string,
    fixed: boolean,
    formattedCreatedAt: string,
    id: number,
    isEnabled: boolean,
    noticeCategory: noticeCategoryType,
    title: string,
    updatedAt: string,
}
export type termsType = {
    contents: string,
    createdAt: string,
    hidden: boolean,
    id: number,
    needAgree: boolean,
    title: string,
    updatedAt: string,
}
export type phoneNumberInputsType = {
    name: string, phoneNumber: string, verificationCode: string
}
