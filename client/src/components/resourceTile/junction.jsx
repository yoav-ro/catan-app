import React, { useState } from "react";
import BuildSettelment from "../modals/buildSettelment";

function Junction({ centerX, centerY, gameSocketRef }) {
    const [radius, setRadius] = useState("3px");
    const handleHover = () => {
        setRadius("10px");
    }

    const handleLeave = () => {
        setRadius("3px");
    }

    const handleClick = () => {
        setShow(true);
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    return (
        <>
            <circle stroke="black" cx={centerX} cy={centerY} r={radius} onMouseEnter={handleHover} onMouseLeave={handleLeave} onClick={handleClick} />
            <BuildSettelment gameSocketRef={gameSocketRef} show={show} handleClose={handleClose} x={centerX} y={centerY} />
        </>
    )
}

export default Junction;