import React, { useState } from "react";
import BuildRoad from "../modals/buildRoad";
import "./styles/road.css"

function Road({ x1, y1, x2, y2, status, player, gameSocketRef }) {
    const color = player ? player : "black";

    const handleClick = () => {
        console.log(`Road, status: ${status}, from (${x1}, ${y1}) to (${x2}, ${y2})`);
        setShow(true);
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    if (color === "black") {
        return (
            <>
                <line x1={x1} y1={y1} x2={x2} y2={y2} className="road" stroke={color} onClick={handleClick} />
                <BuildRoad gameSocketRef={gameSocketRef} show={show} handleClose={handleClose} x1={x1} y1={y1} x2={x2} y2={y2} />
            </>
        )
    }

    return (
        <>
            <line x1={x1} y1={y1} x2={x2} y2={y2} className="roadBorder" stroke="black" onClick={handleClick} />
            <line x1={x1} y1={y1} x2={x2} y2={y2} className="builtRoad" stroke={color} onClick={handleClick} />
        </>
    )
}

export default Road;