import React from 'react';
import "./loading.css";
import { CircularProgress } from "@mui/material";
import { loadingType } from "../../types/componentsType";


const Loading = ({ custom, text }: loadingType) => {
    return (
        <div className={"loadingWrap"}>
            {custom ? (
                <div className={"loadingBox"}>
                    <CircularProgress color="success" sx={{ width: "100px", height: "100px", color: "#6933ff" }} className={"loadingCircle"} />
                    <p>{text} 처리 중입니다.<br/> 완료될 때까지 기다려주세요.</p>
                </div>
            ) : <CircularProgress color="success" sx={{ width: "100px", height: "100px", color: "#6933ff" }} className={"loadingCircle"} />
            }
        </div>
    );
};

export default Loading;