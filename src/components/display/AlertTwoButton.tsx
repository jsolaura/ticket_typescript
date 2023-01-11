import Swal, {SweetAlertOptions} from "sweetalert2";

const AlertTwoButton = (text: string, confirmText?: string, path?: any, history?: any, fn?: any, cancelText?: string) => {
    Swal.fire({
        text: text,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText ? cancelText : '확인',
        reverseButtons: true,
        customClass: {
            actions: 'twoButton'
        }
    }as SweetAlertOptions).then((result: any) => {
        if (result.isConfirmed) {
            if (history === null && path === null) {
                fn();
            } else {
                history.push(path);
            }
        } else {
            return false;
        }
    })
};
export default AlertTwoButton;