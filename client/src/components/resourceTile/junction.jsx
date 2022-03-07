import React, { useState } from "react";

function Junction({ centerX, centerY }) {
    const [status, setStatus] = useState("free");
    const [radius, setRadius] = useState("3px");

    const handleHover = () => {
        setRadius("10px");
    }

    const handleLeave = () => {
        setRadius("3px");
    }

    const handleClick = () => {
        console.log(`Junction, status: ${status}, at (${centerX}, ${centerY})`)
    }

    return (
        <circle stroke="black" cx={centerX} cy={centerY} r={radius} onMouseEnter={handleHover} onMouseLeave={handleLeave} onClick={handleClick} />
    )
}

export default Junction;