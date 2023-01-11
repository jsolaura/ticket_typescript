import React, {useEffect, useState} from 'react';
import './cursor.css';
import classNames from "classnames";
const Cursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [clicked, setClicked] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        addEventListener();
        handleHover();
        return () => removeEventListener();
    }, [])
    const addEventListener = () => {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseenter', onMouseEnter);
        document.addEventListener('mouseleave', onMouseLeave);
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);
    }
    const removeEventListener = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseenter', onMouseEnter);
        document.removeEventListener('mouseleave', onMouseLeave);
        document.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mouseup', onMouseUp);
    }
    const handleHover = () => {
        document.querySelectorAll("em").forEach((el) => {
            el.addEventListener("mouseover", () => setHovered(true));
            el.addEventListener("mouseout", () => setHovered(false));
        });
    }
    const onMouseMove = (e) => {
        setPosition({x: e.clientX, y: e.clientY})
    };
    const onMouseEnter = () => setHidden(false)
    const onMouseLeave = () => setHidden(true);
    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);
    const cursorClasses = classNames("cursor", {
        "clicked": clicked,
        "hidden": hidden,
        "hovered": hovered
    });
    return (
        <div className={cursorClasses} style={{ left: `${position.x}px`, top: `${position.y}px` }} />
    );
};

export default Cursor;