export type ticketType = {
    afterReserveAble?: string | null,
    availableCount: number,
    cancelInfo: string,
    createdDate: string,
    dateInfo: string,
    detailInfo: string,
    endDate: string,
    exchangeInfo: string,
    formattedEndDate: string,
    formattedStartDate: string,
    hostInfo: string,
    id: number,
    isEarlyBird: boolean,
    isReserveBydate: boolean,
    modifiedDate: string,
    paymentInfo: string,
    placeInfo: string,
    ratingInfo: string,
    startDate: string,
    visitInfo: string,
}
export type OptionsType = {
    id?: number,
    name?: string,
    title: string,
    subTitle: string,
    count: number,
    price: number
}
export type exhibitionType = {
    createdDate: string,
    earlyBird: boolean,
    endDate: string,
    formattedEndDate: string,
    formattedStartDate: string,
    id: number,
    imageUrl: string,
    linkUrl?: string | null,
    modifiedDate: string,
    name: string,
    place: string,
    reservationInvalid: boolean,
    seq: number,
    startDate: string,
    visible: boolean
}
export type ticketOrderType = {
    count_option1: number | null,
    count_option2?: number | null,
    count_option3?: number | null,
    count_option4?: number | null,
    count_option5?: number | null,
    count_option6?: number | null,
    count_option7?: number | null,
    count_option8?: number | null,
    count_option9?: number | null,
    count_option10?: number | null,
    exhibitionPlan?: string | null,
    exhibitionPlanId?: number | null,
    formattedPurchasedDate?: string | null,
    formattedUseDate?: string | null,
    id: number,
    method: string,
    orderId: string,
    price: number,
    receipt_id: string,
    status: number,
    ticketId: number,
    used: boolean,
    userId: number,
    user_cellphone: string,
    user_realname: string,
    volume: string,
}
export type orderListType = {
    exhibition: exhibitionType | null,
    exhibitionPlan?: string | null,
    ticket: ticketType,
    ticketOptionList: Array<OptionsType>,
    ticketOrder: ticketOrderType
}
export type orderHistoryType = {
    exhibition: exhibitionType,
    ticket: ticketType,
    exhibitionPlan?: string | null,
    ticketOrder: ticketOrderType,
}
export type infoOptionType = {
    isMobile?: boolean;
    overCount: boolean;
}
export type buyBtnType = {
    totalPrice: number;
    moveToBuyTicket?: () => void;
}