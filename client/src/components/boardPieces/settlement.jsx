import React, { useState } from "react";
import SvgHouse from "./svgHouse";

function Settlement({ color, centerX, centerY }) {
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

    return (
            <g onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut}>
                <SvgHouse centerX={biggerHouseCoords.centerX} centerY={biggerHouseCoords.centerY} scale={1 * scale} color={color} />
            </g>
    )
}

export default Settlement;