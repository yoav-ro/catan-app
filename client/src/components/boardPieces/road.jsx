import React, { useState } from "react";
import BuildRoad from "../modals/buildRoad";
import Junction from "../resourceTile/junction";
import "./styles/road.css"

function Road({ x1, y1, x2, y2, player, gameSocketRef }) {
    const color = player ? player : "black";

    const handleClick = () => {
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
            <line x1={x1} y1={y1} x2={x2} y2={y2} className="roadBorder" stroke="black" />
            <line x1={x1} y1={y1} x2={x2} y2={y2} className="builtRoad" stroke={color} />
            <Junction centerX={x1} centerY={y1} gameSocketRef={gameSocketRef} />
            <Junction centerX={x2} centerY={y2} gameSocketRef={gameSocketRef} />
        </>
    )
}

export default Road;