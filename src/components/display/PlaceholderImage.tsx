import React, { useEffect, useState } from 'react';
import { placeholderImageType } from "../../types/componentsType";

const PlaceholderImage = ({ placeholderSrc, src, ...props }: placeholderImageType) => {
    const [imgSrc, setImgSrc] = useState(placeholderSrc || src);
    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            setImgSrc(src);
        }
    }, [src]);
    return (
        <img
            {...{ src: imgSrc, ...props }}
            alt={props.alt || ""}
            loading="lazy"
            className={`placeholderImg ${placeholderSrc && imgSrc === placeholderSrc ? "loading" : "loaded"}`} />
    );
};

export default PlaceholderImage;