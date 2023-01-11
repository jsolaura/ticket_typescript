import Swal, { SweetAlertOptions } from 'sweetalert2';

const AlertBasic = (text: string, fn?: any, timer?: boolean, custom?: boolean) => {
    Swal.fire({
        html: text,
        confirmButtonText: '확인',
        focusConfirm: false,
        timer: timer ? 1000 : null,
        customClass: {
            actions: custom ? 'active' : null
        }
    } as SweetAlertOptions).then((result: any) => {
        if (result.isConfirmed) {
            if (fn !== null) {
                fn();
            }
        } else {
            return false;
        }
    })
};

export default AlertBasic;