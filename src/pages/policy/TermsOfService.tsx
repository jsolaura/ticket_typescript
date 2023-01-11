import React from 'react';
import styles from '../../styles/Policy.module.css';
import {useAppSelector} from "reducers/hooks";
import {parsingHtml} from "utils/useParsingHtml";

const TermsOfService = () => {
    const termsOfService = useAppSelector((state) => state.common.termsOfService);
    return (
        <div className={styles.policy}>
            <div className={styles.policyWrap}>
                <h2>이용약관</h2>
                <div className={"brElement"} dangerouslySetInnerHTML={parsingHtml(termsOfService && termsOfService.contents.toString() )} />
            </div>
        </div>
    );
};

export default TermsOfService;