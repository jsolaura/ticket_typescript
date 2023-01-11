import http from 'config/Http-common';
import store from "reducers/store";
import { commonAction } from "reducers/common";

const policy = () => {
    return http.get(`/terms`);
}

export const getPolicyList = () => {
    policy()
        .then(response => {
            let privacyPolicy = response.data.data[0];
            let termsOfService = response.data.data[1];
            store.dispatch(commonAction.setPrivacyPolicy(privacyPolicy));
            store.dispatch(commonAction.setTermsOfService(termsOfService));
        })
        .catch(err => console.log(err));
}
