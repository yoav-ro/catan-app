import React, { useState } from "react";
import BuildCity from "../modals/buildCity";
import SvgHouse from "./svgHouse";

function Settlement({ color, centerX, centerY, gameSocketRef }) {
    const [scale, setScale] = useState(1);

    const handleHoverIn = () => {
        setScale(1.3);
    }

    const handleHoverOut = () => {
        setScale(1);
    }

    const biggerHouseCoords = {
        centerX: centerX,
        centerY: centerY
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    return (
        <>
            <g onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut}>
                <SvgHouse centerX={biggerHouseCoords.centerX} centerY={biggerHouseCoords.centerY} scale={1 * scale} color={color} />
            </g>
            <BuildCity x={centerX} y={centerY} show={show} handleClose={handleClose} gameSocketRef={gameSocketRef} />
        </>

    )
}

export default Settlement;