import React, { useCallback } from 'react';
import styles from "../../styles/Sign.module.css";
import { termListType, termsType } from "../../types/authType";

const  Terms = ({ setIsReady, checkedTerms, setCheckedTerms }: termsType) => {
    const termList: Array<termListType> = [
        { id: 1, title: '서비스 이용 약관 (필수)' ,required: true },
        { id: 2, title: '개인정보 처리 방침 (필수)', required: true },
    ];

    const handleCheckSingle = useCallback((checked, id) => {
        if (checked) {
            setCheckedTerms([...checkedTerms, id]);
        } else {
            setCheckedTerms(checkedTerms.filter((el) => el !== id));
        }
    }, [checkedTerms, setCheckedTerms])

    const handleCheckAll = useCallback((checked) => {
        if (checked) {
            setIsReady(true);
            const termArr: Array<string | number> = [];
            termList.forEach(term => termArr.push(term.id));
            setCheckedTerms(termArr);
        } else {
            setCheckedTerms([]);
        }
    }, [termList, setCheckedTerms, setIsReady]);
    return (
        <div className={`${styles.formInput} ${styles.termsContainer}`}>
            <label className={styles.checkAll}>
                <input
                    type={"checkBox"}
                    value={'checked'}
                    checked={
                        checkedTerms.length === 0 ? false : checkedTerms.length === termList.length
                    }
                    onChange={(e) => handleCheckAll(e.currentTarget.checked)}
                />
                <p className={`checkBtn ${styles.termsCheckBtn} ${ checkedTerms.length === 2 ? styles.active : ''}`} />
                전체약관 동의
            </label>
            <ul className={styles.termsSubContainer}>
                {termList.map((term, index) => (
                    <li key={term.id}>
                        <label className={styles.subLabel}>
                            <div className={styles.termSubInput}>
                                <input
                                    type={"checkbox"}
                                    id={term.id.toString()}
                                    value={"checked"}
                                    checked={checkedTerms.includes(term.id)}
                                    onChange={(e) => handleCheckSingle(e.currentTarget.checked, term.id)}
                                />
                                <p className={`${styles.termsCheckBtn} ${checkedTerms.includes(term.id) ? styles.active : ''}`}> </p>
                                {term.title}
                            </div>
                        </label>
                        <button className={"termLink"} onClick={() => window.open(term.id === 1 ? "/faq/policy/TermsOfService" : "/faq/policy/PrivacyPolicy", "_blank")} />
                        {/*{term.popup}*/}
                    </li>
                ))}
            </ul>
            <span className={"caption"} style={{ letterSpacing: "-1px", marginTop: '10px' }}>* 회원가입 시 본인이 만 14세 이상임에 동의하게 됩니다.</span>
        </div>
    );
};

export default Terms;