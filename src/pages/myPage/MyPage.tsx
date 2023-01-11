import React, {useEffect} from 'react';
import styles from '../../styles/MyPage.module.css';
import Account from "./Account";
import OrderList from "./OrderList";
import { useCookies } from "react-cookie";
import { getUserInfo, getUserOrderTicketList } from "../../service/MyPageService";

const MyPage = () => {
    const [, setCookieUser] = useCookies(['user']);
    useEffect(() => {
        getUserInfo(setCookieUser);
        getUserOrderTicketList();
    }, [])
    return (
        <div className={`${styles.myPageWrap}`}>
            <h2>마이페이지</h2>
            <section className={styles.myContainer}>
                <OrderList />
                <Account />
            </section>
        </div>
    );
};

export default MyPage;