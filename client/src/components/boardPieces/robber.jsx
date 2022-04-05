import React from "react";

function Robber({ tileCX, tileCY }) {


    return (
        <g>
            <circle cx={tileCX} cy={tileCY - 17} r={11} />
            <ellipse cx={tileCX} cy={tileCY} rx={13} ry={20} />
            <rect x={tileCX- 15} y={tileCY+12} width={30} height={10} radius={20}/>
        </g>
    )
}

export default Robber;