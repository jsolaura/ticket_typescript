import React from 'react';
import { tabPanelType } from "../../types/componentsType";

const TabPanel = (props: tabPanelType) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <div className={"tabContainer"}>{children}</div>
            )}
        </div>
    );
};

export default TabPanel;