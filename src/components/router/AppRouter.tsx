import React, { useEffect } from 'react';
import "./router.css";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Loading from "../loading/Loading";
import AppPopup from "../layout/AppPopup";
import Header from "../layout/Header";
import CustomerService from "pages/customerService/CustomerService";
// import TicketMain from "pages/ticket/TicketMain";
// import Error404 from "pages/error/Error404";
// import Login from "pages/login/Login";
// import Register from "pages/register/Register";
// import Redirect from "pages/login/Redirect";
// import FindPassword from "pages/login/findPassword/FindPassword";
// import TicketDetail from "pages/ticket/TicketDetail";
// import TicketCheckout from "pages/ticket/TicketCheckout";
// import OrderComplete from "pages/myPage/OrderComplete";
// import MyPage from "pages/myPage/MyPage";
import localStorage from "redux-persist/es/storage";
import { useMediaQuery } from "react-responsive";
import store from "reducers/store";
import { commonAction } from "reducers/common";
import { myPageAction } from "reducers/myPage";
import { mainAction } from "reducers/main";
import { authAction } from "reducers/auth";
import { resetOptions } from "utils/useReset";
import { useCookies } from "react-cookie";
import { useAppSelector } from "reducers/hooks";
import {
    customerServiceUrl, errorUrl, findPasswordUrl, loginUrl,
    mainUrl,
    myPageUrl,
    myPageTicketOrderUrl, oauthUrl, privacyPolicyUrl, registerUrl, termsOfUseUrl,
    ticketCheckoutUrl,
    ticketDetailsUrl
} from "config/urlConfig";
import TicketMain from 'pages/ticket/TicketMain';
import TicketDetail from "pages/ticket/TicketDetail";
import TicketCheckout from "pages/ticket/TicketCheckout";
import MyPage from "pages/myPage/MyPage";
import Redirect from "pages/login/Redirect";
import Login from "pages/login/Login";
import FindPassword from "pages/login/findPassword/FindPassword";
import Register from "pages/register/Register";
import OrderComplete from "pages/myPage/OrderComplete";

const AppRouter = () => {
    const location = useLocation();
    const isMobile = useMediaQuery({ query: "(max-width: 480px)" })
    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
    const loading = useAppSelector((state) => state.common.loading);
    const loadingCustom = useAppSelector((state) => state.common.loadingCustom);
    const loadingText = useAppSelector((state) => state.common.loadingText);
    const path = useAppSelector((state) => state.common.currentPath);
    const [cookie, , ] = useCookies(['appPopup']);
    const history = useHistory();
    useEffect(() => {
        return history.listen((location) => {
            let changePath = location.pathname.split('/')[1];
            store.dispatch(commonAction.setPrevPath(path));
            store.dispatch(commonAction.setCurrentPath(changePath));
            if (path !== changePath) {
                switch (path) {
                    case 'customerService' :
                        localStorage.removeItem('page');
                        break;
                    default:
                        break;
                }
            }
            if (isLoggedIn && path !== changePath) {
                switch (path) {
                    case 'myPage' :
                        store.dispatch(myPageAction.reset());
                        break;
                    case '' :
                        store.dispatch(mainAction.reset());
                        break;
                    default:
                        break;
                }
            } else if (!isLoggedIn && path !== changePath) {
                switch (path) {
                    case 'register' :
                        store.dispatch(authAction.reset());
                        break;
                    default:
                        break;
                }
            }
        });
    },[history, path, isLoggedIn]);

    useEffect(() => {
        let pathName = location.pathname;
        if (pathName === termsOfUseUrl || pathName === privacyPolicyUrl) {
            store.dispatch(commonAction.openPolicyWindow());
        }
        if (pathName.indexOf(ticketDetailsUrl) === -1 && pathName !== loginUrl) {
            resetOptions();
        }
        if (isLoggedIn) {
            switch (pathName) {
                case loginUrl
                    : history.push(mainUrl)
                    break;
                case findPasswordUrl
                    : history.push(mainUrl)
                    break;
                case registerUrl
                    : history.push(mainUrl)
                    break;
                case oauthUrl
                    : history.push(mainUrl)
                    break;
                case ticketDetailsUrl
                    : history.push(ticketDetailsUrl)
                    break;
                case ticketCheckoutUrl
                    : history.push(ticketCheckoutUrl)
                    break;
                default
                    : break;
            }
        } else {
            switch (pathName) {
                case myPageUrl
                    : history.push(mainUrl)
                    break;
                case myPageTicketOrderUrl
                    : history.push(mainUrl)
                    break;
                default
                    : break;
            }
        }
    }, [isLoggedIn, location.pathname, history])

    return (
        <div className={`wrapper ${loading || isMobile ? !cookie.appPopup ? "loading" : "" : ""}`}>
            {loading && <Loading custom={loadingCustom} text={loadingText} />}
            {isMobile && !cookie.appPopup ? <AppPopup /> : null}
            <Header />
            <TransitionGroup className={"transition-group"}>
                <CSSTransition key={location.pathname} classNames={"pageSlider"} timeout={500}>
                    {isLoggedIn
                        ? (
                            <Switch location={location}>
                                <>
                                    <Route exact path={mainUrl} component={TicketMain} />
                                    <Route exact path={myPageUrl} component={MyPage} />
                                    <Route exact path={'/myPage/ticketOrder/detail/:id'} component={OrderComplete} />
                                    <Route exact path={ticketDetailsUrl} component={TicketDetail} />
                                    <Route exact path={ticketCheckoutUrl} component={TicketCheckout} />
                                    <Route exact path={'/ticketDetails/ticketOrder/completed/:id'} component={OrderComplete} />
                                    <Route exact path={customerServiceUrl} component={CustomerService} />
                                    {/*<Route exact path={errorUrl} component={Error404} />*/}
                                </>
                            </Switch>
                        )
                        : (
                            <Switch location={location}>
                                <>
                                    <Route exact path={mainUrl} component={TicketMain} />
                                    <Route exact path={ticketDetailsUrl} component={TicketDetail} />
                                    <Route exact path={oauthUrl} component={Redirect} />
                                    <Route exact path={loginUrl} component={Login} />
                                    <Route exact path={findPasswordUrl} component={FindPassword} />
                                    <Route exact path={registerUrl} component={Register} />
                                    <Route exact path={customerServiceUrl} component={CustomerService} />
                                    {/*<Route exact path={errorUrl} component={Error404} />*/}
                                </>
                            </Switch>
                        )
                    }
                </CSSTransition>
            </TransitionGroup>
        </div>
    );
};

export default AppRouter;