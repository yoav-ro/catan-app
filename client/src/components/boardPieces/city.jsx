import React, { useState } from "react";
import SvgHouse from "./svgHouse";

function City({ color, centerX, centerY }) {
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
    const smallHouseCoords = {
        centerX: centerX + 10,
        centerY: centerY + 3.7
    }

    return (
        <svg width={1000} height={1000}>
            <g onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut}>
                <SvgHouse centerX={biggerHouseCoords.centerX} centerY={biggerHouseCoords.centerY} scale={1 * scale} color={color} />
                <SvgHouse centerX={smallHouseCoords.centerX} centerY={smallHouseCoords.centerY} scale={0.7 * scale} color={color} />
            </g>
        </svg>
    )
}

export default City;