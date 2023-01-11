export const blankValidation = (el: HTMLInputElement | null, els: string[] | null) => {
    if (els) {
        if (els?.length > 1) {
            els?.forEach(el => {
                return el?.length <= 2;
            });
        }
    } else {
        if (el) {
            return el?.value.length > 2
        }
    } ;
}
export const sameCheckValidation = (a: string | number | null, b: string | number | null) => {
    return a !== b
}
