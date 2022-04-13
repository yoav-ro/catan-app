import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrModal } from "../../actions";
import { modalTypes } from "../../utils/constants";

function Junction({ centerX, centerY, showModal }) {
    const [status, setStatus] = useState("free");
    const [radius, setRadius] = useState("3px");
    const dispatch=useDispatch();

    const handleHover = () => {
        setRadius("10px");
    }

    const handleLeave = () => {
        setRadius("3px");
    }

    const handleClick = () => {
        console.log(`Junction, status: ${status}, at (${centerX}, ${centerY})`)
        dispatch(setCurrModal(modalTypes.buildSettelment));
        showModal(true);
    }

    return (
        <circle stroke="black" cx={centerX} cy={centerY} r={radius} onMouseEnter={handleHover} onMouseLeave={handleLeave} onClick={handleClick} />
    )
}

export default Junction;