import styles from "../styles/Ticket.module.css";
import React, { ReactElement } from "react";

export const RegexOption= ({ data }: any): ReactElement => {
    let optionName = data.replace(/\((.*)\)/, ``);
    let subOptionName = data.match(/\(([^)]+)\)/g).join("");
    return <label className={styles.optionName}>{optionName} <span>{subOptionName}</span></label>
}
