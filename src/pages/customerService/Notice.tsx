import React, {SyntheticEvent, useEffect, useState} from 'react';
import styles from '../../styles/Service.module.css';
import { styled } from '@mui/material/styles';
import MuiAccordion, {AccordionProps} from "@mui/material/Accordion";
import MuiAccordionSummary, {AccordionSummaryProps} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Pagination from "@mui/material/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { commonAction } from "reducers/common";
import { useAppDispatch, useAppSelector } from "reducers/hooks";
import { getNoticeList } from "../../service/CustomerService";
import { parsingHtml } from "utils/useParsingHtml";

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: 0,
    padding: 0,
}));
const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<FontAwesomeIcon icon={faAngleDown} />}
        {...props}
    />
))(({ theme }) => ({
    border: 0,
    borderBottom: '1px solid #c8c8c8',
    padding: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    '& .qpickerAccordionSummary-expandIconWrapper': {
        marginRight: '15px',
    },
    '& .qpickerAccordionSummary-content': {
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '25px 15px',
        margin: 0,

    },
}));
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: '60px 30px',
    borderBottom: '1px solid #c8c8c8',
    position: 'relative',
}));

const Notice = () => {
    const dispatch = useAppDispatch();
    const noticeList = useAppSelector((state) => state.common.noticeList);
    const totalCount = useAppSelector((state) => state.common.noticeTotalCount);
    const limit = useAppSelector((state) => state.common.limit);
    const page = useAppSelector((state) => state.common.page);

    let localPage = localStorage.getItem('page');

    const [pageCount, setPageCount] = useState<any>(() => localPage || 0);
    const [expanded, setExpanded] = useState<string | false>(false);

    useEffect(() => {
        localStorage.setItem('page', pageCount);
        dispatch(commonAction.setPage(pageCount));
    }, [pageCount])

    useEffect(() => {
        getNoticeList(Number(localPage) , limit);
    }, [])
    const handleChangeAcc = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };
    const handlePageChange = (event, value) => {
        setExpanded(false);
        getNoticeList(value - 1, limit);
        dispatch(commonAction.setPage(value));
        setPageCount(value - 1);
    }
    return (
        <>
            <ul>
                {noticeList?.map((value, index) => (
                    <li key={index}>
                        <Accordion expanded={expanded === `panel${index}`} onChange={handleChangeAcc(`panel${index}`)}>
                            <AccordionSummary
                                expandIcon={<FontAwesomeIcon icon={faAngleDown} />}
                                aria-controls={`panel${index}-content`}
                                id={`panel${index}-header`}
                                className={styles.noticeHeaderWrap}
                            >
                                <p className={styles.noticeCategory}>{value.noticeCategory.name}</p>
                                <p className={styles.noticeName}>{value.title}</p>
                                <span className={`caption ${styles.noticeDate}`}>{value.formattedCreatedAt}</span>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className={styles.noticeContent} dangerouslySetInnerHTML={parsingHtml(value.content)} />
                            </AccordionDetails>
                        </Accordion>
                    </li>
                ))}
            </ul>
            <Pagination page={Number(page+1)} className={"qpickerPagination"} onChange={handlePageChange} count={Math.ceil(totalCount/limit)} />
        </>
    );
};

export default Notice;