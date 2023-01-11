import './App.css';
import { FC, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useAppSelector } from "reducers/hooks";
import { privacyPolicyUrl, termsOfUseUrl } from 'config/urlConfig';
import TermsOfService from 'pages/policy/TermsOfService';
import PrivacyPolicy from 'pages/policy/PrivacyPolicy';
import ScrollToTop from "components/layout/ScrollToTop";
import AppRouter from "components/router/AppRouter";
import { getPolicyList } from "./service/PolicyService";
import { getTicketList } from "./service/TicketService";
import { getNoticeList } from "./service/CustomerService";

const App: FC = () => {
    const policy = useAppSelector((state) => state.common.policy);
    const limit = useAppSelector((state) => state.common.limit);
    let page = localStorage.getItem('page');

    useEffect(() => {
        getNoticeList(page !== null ? JSON.parse(page) : 0, limit);
        getPolicyList();
        getTicketList();
    }, []);

    return (
        <Router>
            <ScrollToTop/>
            {policy
                ? <>
                    <Route exact path={termsOfUseUrl} component={TermsOfService}/>
                    <Route exact path={privacyPolicyUrl} component={PrivacyPolicy}/>
                </>
                : <AppRouter/>
            }
        </Router>
    )
}
export default App;