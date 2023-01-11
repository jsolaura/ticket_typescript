import React from 'react';
import { useAppDispatch, useAppSelector } from "reducers/hooks";
// import { commonActions } from "reducers/common";

const GoToTop = ({ value }) => {
    const dispatch = useAppDispatch();
    const scrollY = useAppSelector((state) => state.common.scrollY);
    const goToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        // dispatch(commonActions.setScroll0())
    }
    return (
        <button onClick={goToTop} className={`topBtn ${scrollY > value ? 'fixed' : ''}`}>
            <span />
        </button>
    );
};

export default GoToTop;