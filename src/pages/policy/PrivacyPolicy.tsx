import React from 'react';
import styles from "../../styles/Policy.module.css";
import { useAppSelector } from "reducers/hooks";
import { parsingHtml } from "utils/useParsingHtml";

const PrivacyPolicy = () => {
    const privacyPolicy = useAppSelector((state) => state.common.privacyPolicy);
    return (
        <div className={styles.policy}>
            <div className={styles.policyWrap}>
                <h2>개인정보처리방침</h2>
                <div className={"brElement"} dangerouslySetInnerHTML={parsingHtml(privacyPolicy && privacyPolicy?.contents)} />
            </div>
        </div>
    );
};

export default PrivacyPolicy;