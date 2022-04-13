import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, Form, Button } from "react-bootstrap";
import BuildSettelment from "../modals/buildSettelment";

function Junction({ centerX, centerY }) {
    const [radius, setRadius] = useState("3px");
    const dispatch = useDispatch();

    const handleHover = () => {
        setRadius("10px");
    }

    const handleLeave = () => {
        setRadius("3px");
    }

    const handleClick = () => {
        console.log(`Junction, at (${centerX}, ${centerY})`)
        setShow(true);
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    return (
        <>
            <circle stroke="black" cx={centerX} cy={centerY} r={radius} onMouseEnter={handleHover} onMouseLeave={handleLeave} onClick={handleClick} />
            <BuildSettelment show={show} handleClose={handleClose} x={centerX} y={centerY} />
        </>



    )
}

export default Junction;