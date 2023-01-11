import React, {useEffect, useState} from 'react';
import styles from "../../styles/Service.module.css";
import { Tab, Tabs, ThemeProvider } from "@mui/material";
import { theme } from "utils/useBasicTheme";
import { panelProps } from "utils/useTabPanel";
import TabPanel from "components/display/TabPanel";
import Notice from "./Notice";
import Inquiry from "./Inquiry";

const CustomerService = () => {
    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: any) => {
        setValue(newValue);
    };
    useEffect(() => {
        if (value === 1) {
            localStorage.removeItem('page');
        }
    }, [value])
    return (
        <div className={`${styles.csWrap}`}>
            <h1>고객센터</h1>
            <nav className={styles.csNav}>
                <ThemeProvider theme={theme}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        className={styles.csGnb}
                        textColor={"secondary"}
                        indicatorColor={"secondary"}
                    >
                        <Tab label="공지사항" {...panelProps(0)} />
                        <Tab label="문의하기" {...panelProps(1)} />
                    </Tabs>
                </ThemeProvider>
            </nav>
            <TabPanel value={value} index={0}>
                <Notice />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Inquiry />
            </TabPanel>
        </div>
    );
};

export default CustomerService;