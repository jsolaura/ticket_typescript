import React, { useEffect } from 'react';
import Loading from "components/loading/Loading";
import { commonAction } from "reducers/common";
import { useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useAppDispatch } from "reducers/hooks";
import { loginServiceSNS } from "../../service/AuthService";

const Redirect = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const authType = localStorage.getItem('authType');
    let code = new URL(window.location.href).searchParams.get('code');
    const [, setCookieUser] = useCookies(['user']);
    const [, setCookieToken] = useCookies(['token']);
    useEffect(() => {
        dispatch(commonAction.setLoading(true));
        loginServiceSNS(code, authType, history, setCookieUser, setCookieToken);
    }, [])
    return (
        <Loading />
    );
};

export default Redirect;