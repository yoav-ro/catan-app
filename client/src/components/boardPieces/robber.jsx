import React from "react";
import { resourcesTypes } from "../../utils/constants";

function Robber({ tileCX, tileCY, shouldRender, resourceType }) {
    const opacity = resourceType === resourcesTypes.DESERT ? 0.6 : 1;
    
    if (!shouldRender) {
        return (
            <></>
        )
    }

    return (
        <g>
            <circle cx={tileCX} cy={tileCY - 15} r={8} opacity={opacity}/>
            <ellipse cx={tileCX} cy={tileCY + 3} rx={10} ry={17} opacity={opacity}/>
            <rect x={tileCX - 11} y={tileCY + 13} width={22} height={8} opacity={opacity}/>
        </g>
    )
}

export default Robber;