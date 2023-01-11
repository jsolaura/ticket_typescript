
const changePasswordType = (el: any, setType: any) => {
    if (el) {
        setType(() => {
            if (!el.visible) {
                return { type: "text", visible: true };
            }
            return { type: 'password', visible: false };
        });
    }
}
export default changePasswordType;